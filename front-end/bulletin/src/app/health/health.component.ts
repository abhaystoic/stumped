import { Component, OnInit } from '@angular/core';

import { SocialAuthService, SocialUser } from "angularx-social-login";

import { ApiService } from '../api.service';
import { CommonFunctionsService } from '../common-functions.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css', '../global.css']
})
export class HealthComponent implements OnInit {

  healthNews;
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
        this.fetchHealthNews();
      });
  }

  ngOnInit(): void {}

  fetchHealthNews(page: number = 1) {
    this.splashService.updateSplashState(true);
    // setTimeout(() =>this.splashService.updateSplashState(true), 0);
  	this.apiService.getHealthNews(page).subscribe( async (data) => {
      if (this.user) {
        // Add articles that were saved by the user earlier.
        this.healthNews = 
          await this.commonFunctionsService.addSavedArticlesDetailsToNews(
            this.user.email, this.user.provider, this.pageName,
            data['records']['articles']);
      } else {
        this.healthNews = data['records']['articles'];
        this.healthNews.forEach((article, index) => {
          this.healthNews[index]['savedArticle'] = false;
        });
      }
      this.maxPages = data['max_pages'];
      // setTimeout(() =>this.splashService.updateSplashState(false), 200);
      this.splashService.updateSplashState(false);
    });
  }

  async saveHealthNews(newsId: string) {
    let response = await this.apiService.saveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async unSaveHealthNews(newsId: string) {
    let response = await this.apiService.unSaveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async saveHealthNewsSentiment(newsId: string, sentiment: string) {
    let response = await this.apiService.saveSentiment(
      this.user.email, this.user.provider, newsId, sentiment).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

}
