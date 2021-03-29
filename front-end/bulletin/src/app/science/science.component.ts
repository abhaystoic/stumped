import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SocialAuthService, SocialUser } from "angularx-social-login";

import { ApiService } from '../api.service';
import { CommonFunctionsService } from '../common-functions.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-science',
  templateUrl: './science.component.html',
  styleUrls: ['./science.component.css', '../global.css']
})
export class ScienceComponent implements OnInit {

  scienceNews;
  loggedIn: boolean;
  maxPages: number = 1;
  pageName: string = 'science';
  showSplash: boolean = true;
  user: SocialUser;

  constructor(
    private authService: SocialAuthService,
    private apiService: ApiService,
    private commonFunctionsService: CommonFunctionsService,
    private splashService: SplashService, public title: Title) {
      this.title.setTitle('iBot News | Science News');
      this.authService.authState.subscribe(user => {
        this.user = user;
        this.loggedIn = (user != null);
        this.fetchScienceNews();
      });
  }

  ngOnInit(): void {}

  fetchScienceNews(page: number = 1) {
    this.splashService.updateSplashState(true);
    // setTimeout(() =>this.splashService.updateSplashState(true), 0);
  	this.apiService.getScienceNews(page).subscribe( async (data) => {
      if (this.user) {
        // Add articles that were saved by the user earlier.
        this.scienceNews = 
          await this.commonFunctionsService.addSavedArticlesDetailsToNews(
            this.user.email, this.user.provider, this.pageName,
            data['records']['articles']);
      } else {
        this.scienceNews = data['records']['articles'];
        this.scienceNews.forEach((article, index) => {
          this.scienceNews[index]['savedArticle'] = false;
        });
      }
      this.maxPages = data['max_pages'];
      // setTimeout(() =>this.splashService.updateSplashState(false), 200);
      this.splashService.updateSplashState(false);
    });
  }

  async saveScienceNews(newsId: string) {
    let response = await this.apiService.saveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async unSaveScienceNews(newsId: string) {
    let response = await this.apiService.unSaveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async saveScienceNewsSentiment(newsId: string, sentiment: string) {
    let response = await this.apiService.saveSentiment(
      this.user.email, this.user.provider, newsId, sentiment).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

}
