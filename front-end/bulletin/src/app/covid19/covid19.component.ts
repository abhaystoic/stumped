import { Component, OnInit } from '@angular/core';

import { SocialAuthService, SocialUser } from "angularx-social-login";

import { ApiService } from '../api.service';
import { CommonFunctionsService } from '../common-functions.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.css', '../global.css']
})
export class Covid19Component implements OnInit {
  
  covid19News;
  loggedIn: boolean;
  maxPages: number = 1;
  pageName: string = 'covid19';
  showSplash: boolean = true;
  user: SocialUser;

  constructor(
    private authService: SocialAuthService,
    private apiService: ApiService,
    private commonFunctionsService: CommonFunctionsService,
    private splashService: SplashService) {
      this.authService.authState.subscribe(user => {
        this.user = user;
        this.loggedIn = (user != null);
        this.fetchCovid19News();
      });
  }

  ngOnInit(): void {}

  fetchCovid19News(page: number = 1) {
    this.splashService.updateSplashState(true);
    this.apiService.getCovid19News(page).subscribe( async (data) => {
      if (this.user) {
        // Add articles that were saved by the user earlier.
        this.covid19News = 
          await this.commonFunctionsService.addSavedArticlesDetailsToNews(
            this.user.email, this.user.provider, this.pageName,
            data['records']['articles']);
      } else {
        this.covid19News = data['records']['articles'];
        this.covid19News.forEach((article, index) => {
          this.covid19News[index]['savedArticle'] = false;
        });
      }
      this.maxPages = data['max_pages'];
      // setTimeout(() =>this.splashService.updateSplashState(false), 200);
      this.splashService.updateSplashState(false);
    });
  }

  async saveCovid19News(newsId: string) {
    let response = await this.apiService.saveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async unSaveCovid19News(newsId: string) {
    let response = await this.apiService.unSaveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async saveCovid19NewsSentiment(newsId: string, sentiment: string) {
    let response = await this.apiService.saveSentiment(
      this.user.email, this.user.provider, newsId, sentiment).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

}

