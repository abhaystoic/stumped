import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SocialAuthService, SocialUser } from "angularx-social-login";

import { ApiService } from '../api.service';
import { CommonFunctionsService } from '../common-functions.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-entertainment',
  templateUrl: './entertainment.component.html',
  styleUrls: ['./entertainment.component.css', '../global.css']
})
export class EntertainmentComponent implements OnInit {

  entertainmentNews;
  loggedIn: boolean;
  maxPages: number = 1;
  pageName: string = 'entertainment';
  showSplash: boolean = true;
  user: SocialUser;

  constructor(
    private authService: SocialAuthService,
    private apiService: ApiService,
    private commonFunctionsService: CommonFunctionsService,
    private splashService: SplashService, public title: Title) {
      this.title.setTitle('iBot News | Entertainment News');
      this.authService.authState.subscribe(user => {
        this.user = user;
        this.loggedIn = (user != null);
        this.fetchEntertainmentNews();
      });
  }

  ngOnInit(): void {}

  fetchEntertainmentNews(page: number = 1) {
    this.splashService.updateSplashState(true);
    this.apiService.getEntertainmentNews(page).subscribe( async (data) => {
      if (this.user) {
        // Add articles that were saved by the user earlier.
        this.entertainmentNews = 
          await this.commonFunctionsService.addSavedArticlesDetailsToNews(
            this.user.email, this.user.provider, this.pageName,
            data['records']['articles']);
      } else {
        this.entertainmentNews = data['records']['articles'];
        this.entertainmentNews.forEach((article, index) => {
          this.entertainmentNews[index]['savedArticle'] = false;
        });
      }
      this.maxPages = data['max_pages'];
      // setTimeout(() =>this.splashService.updateSplashState(false), 200);
      this.splashService.updateSplashState(false);
    });
  }

  async saveEntertainmentNews(newsId: string) {
    let response = await this.apiService.saveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async unSaveEntertainmentNews(newsId: string) {
    let response = await this.apiService.unSaveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async saveEntertainmentNewsSentiment(newsId: string, sentiment: string) {
    let response = await this.apiService.saveSentiment(
      this.user.email, this.user.provider, newsId, sentiment).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

}
