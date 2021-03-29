import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

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
  maxPages: number = 1;
  pageName: string = 'covid19';
  showSplash: boolean = true;
  user: SocialUser;

  constructor(
    private apiService: ApiService,
    private authService: SocialAuthService,
    private commonFunctionsService: CommonFunctionsService,
    private splashService: SplashService, public title: Title) {
      this.title.setTitle('iBot News | Headlines');
      this.authService.authState.subscribe(user => {
        this.user = user;
        this.loggedIn = (user != null);
        this.fetchHeadlines();
      });
  }

  ngOnInit(): void {}

  fetchHeadlines(page: number = 1) {
    this.splashService.updateSplashState(true);
  	this.apiService.getHeadlines(page).subscribe( async (data) => {
      if (this.user) {
        // Add articles that were saved by the user earlier.
        this.headlines = 
          await this.commonFunctionsService.addSavedArticlesDetailsToNews(
            this.user.email, this.user.provider, this.pageName,
            data['records']['articles']);
      } else {
        this.headlines = data['records']['articles'];
        this.headlines.forEach((article, index) => {
          this.headlines[index]['savedArticle'] = false;
        });
      }
      this.maxPages = data['max_pages'];
      this.splashService.updateSplashState(false);
    });
  }

  async saveHeadlines(newsId: string) {
    let response = await this.apiService.saveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async unSaveHeadlines(newsId: string) {
    let response = await this.apiService.unSaveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async saveHeadlinesSentiment(newsId: string, sentiment: string) {
    let response = await this.apiService.saveSentiment(
      this.user.email, this.user.provider, newsId, sentiment).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

}
