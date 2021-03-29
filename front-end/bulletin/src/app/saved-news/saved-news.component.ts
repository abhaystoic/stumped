import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { 
  FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser 
} from "angularx-social-login";

import { ApiService } from '../api.service';
import { CommonFunctionsService } from '../common-functions.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-saved-news',
  templateUrl: './saved-news.component.html',
  styleUrls: ['./saved-news.component.css', '../global.css']
})
export class SavedNewsComponent implements OnInit {

  hideEverythingUntilVerified: boolean;
  loggedIn: boolean;
  maxPages: number = 1;
  pageName: string = 'saved-news';
  savedNewsArticles: object[];
  showSplash: boolean = true;
  user: SocialUser;
  
  constructor(
    private apiService: ApiService, private authService: SocialAuthService,
    private commonFunctionsService: CommonFunctionsService,
    private splashService:SplashService, public title: Title) {
      this.title.setTitle('iBot News | My Saved News');
  }

  ngOnInit(): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.hideEverythingUntilVerified = true;
    this.authService.authState.subscribe((user) => {
      setTimeout(() =>this.splashService.updateSplashState(false), 0);
      this.user = user;
      this.loggedIn = (user != null);
      this.hideEverythingUntilVerified = false;
      console.log("MyProfileComponent===>", user);
      if (this.loggedIn) {
        /**
         * Fetches saved news articles for the user.
         */
        this.fetchSavedNews();
      }
    });
  }

  fetchSavedNews(page: number = 1) {
    // setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.splashService.updateSplashState(true);
    this.apiService.getSavedNewsArticles(
      this.user.email, this.user.provider, 'saved-news').subscribe(
        async (data) => {
          if (this.user) {
            // Add articles that were saved by the user earlier.
            this.savedNewsArticles = 
              await this.commonFunctionsService.addSavedArticlesDetailsToNews(
                this.user.email, this.user.provider, this.pageName,
                data['saved_news_articles']);
            console.log('this.headlines==', this.savedNewsArticles);
          }
          else {
            this.savedNewsArticles = data['saved_news_articles'];
            this.savedNewsArticles.forEach((article, index) => {
              this.savedNewsArticles[index]['savedArticle'] = false;
            });
          }
          // setTimeout(() =>this.splashService.updateSplashState(false), 200);
          this.splashService.updateSplashState(false);
    });
  }

  async saveNews(newsId: string) {
    console.log('saveNews====>', newsId);
    let response = await this.apiService.saveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async unsaveNews(newsId: string) {
    console.log('unSaveNews====>', newsId);
    let response = await this.apiService.unSaveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async saveNewsSentiment(newsId: string, sentiment: string) {
    console.log('saveNewsSentiment==>', newsId, sentiment);
    let response = await this.apiService.saveSentiment(
      this.user.email, this.user.provider, newsId, sentiment).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
