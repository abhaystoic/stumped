import { Component, OnInit } from '@angular/core';

import { SocialAuthService, SocialUser } from "angularx-social-login";

import { ApiService } from '../api.service';
import { CommonFunctionsService } from '../common-functions.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css', '../global.css']
})
export class BusinessComponent implements OnInit {

  businessNews;
  loggedIn: boolean;
  maxPages: number;
  pageName: string = 'business';
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
        this.fetchBusinessNews();
      });
  }

  ngOnInit(): void {}

  fetchBusinessNews(page: number = 1) {
    this.splashService.updateSplashState(true);
    // setTimeout(() =>this.splashService.updateSplashState(true), 0);
  	this.apiService.getBusinessNews(page).subscribe( async (data) => {
      if (this.user) {
        // Add articles that were saved by the user earlier.
        this.businessNews = 
          await this.commonFunctionsService.addSavedArticlesDetailsToNews(
            this.user.email, this.user.provider, this.pageName,
            data['records']['articles']);
      } else {
        this.businessNews = data['records']['articles'];
        this.businessNews.forEach((article, index) => {
          this.businessNews[index]['savedArticle'] = false;
        });
      }
      this.maxPages = data['max_pages'];
      // setTimeout(() =>this.splashService.updateSplashState(false), 200);
      this.splashService.updateSplashState(false);
    });
  }

  async saveBusinessNews(newsId: string) {
    let response = await this.apiService.saveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async unSaveBusinessNews(newsId: string) {
    let response = await this.apiService.unSaveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async saveBusinessNewsSentiment(newsId: string, sentiment: string) {
    let response = await this.apiService.saveSentiment(
      this.user.email, this.user.provider, newsId, sentiment).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

}
