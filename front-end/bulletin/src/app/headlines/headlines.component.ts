import { Component, OnInit } from '@angular/core';

import { SocialAuthService, SocialUser } from "angularx-social-login";

import { ApiService } from '../api.service';
import { CommonFunctionsService } from '../common-functions.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-headlines',
  templateUrl: './headlines.component.html',
  styleUrls: ['./headlines.component.css', '../global.css']
})
export class HeadlinesComponent implements OnInit {
  headlines;
  loggedIn: boolean;
  pageName: string = 'headlines';
  showSplash: boolean = true;
  user: SocialUser;

  constructor(
    private apiService: ApiService,
    private authService: SocialAuthService,
    private commonFunctionsService: CommonFunctionsService,
    private splashService: SplashService) {
      this.authService.authState.subscribe(user => {
        this.user = user;
        this.loggedIn = (user != null);
        console.log('HeadlinesComponent===========>', user);
        this.fetchHeadlines();
      });
    }

  ngOnInit(): void {}

  fetchHeadlines() {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
  	this.apiService.getHeadlines().subscribe( async (data) => {
      if (this.user) {
        // Add articles that were saved by the user earlier.
        this.headlines = 
          await this.commonFunctionsService.addSavedArticlesDetailsToNews(
            this.user.email, this.user.provider, this.pageName,
            data['articles']);
        console.log('this.headlines==', this.headlines);
      }
      else {
        this.headlines = data['articles'];
        this.headlines.forEach((article, index) => {
          this.headlines[index]['savedArticle'] = false;
        });
      }
      setTimeout(() =>this.splashService.updateSplashState(false), 200);
    });
  }

  async saveHeadlines(newsId: string) {
    console.log('saveHeadlines====>', newsId);
    let response = await this.apiService.saveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async unSaveHeadlines(newsId: string) {
    console.log('unSaveHeadlines====>', newsId);
    let response = await this.apiService.unSaveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async saveHeadlinesSentiment(newsId: string, sentiment: string) {
    console.log('saveHeadlinesSentiment==>', newsId, sentiment);
    let response = await this.apiService.saveSentiment(
      this.user.email, this.user.provider, newsId, sentiment).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

}
