import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SocialAuthService, SocialUser } from "angularx-social-login";

import { ApiService } from '../api.service';
import { CommonFunctionsService } from '../common-functions.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css', '../global.css']
})
export class SearchComponent implements OnInit {

  query: string = '';
  searchResults: Array<object> = [];
  loggedIn: boolean;
  maxPages: number = 1;
  pageName: string = 'search';
  showSplash: boolean = true;
  user: SocialUser;
  
  constructor(
    private authService: SocialAuthService,
    private apiService: ApiService,
    private commonFunctionsService: CommonFunctionsService,
    private route:ActivatedRoute,
    private splashService: SplashService) {
      this.authService.authState.subscribe(user => {
        this.user = user;
        this.loggedIn = (user != null);
        this.fetchSearchNews();
      });
  }

  ngOnInit(): void {
    console.log('in ngOnInit of SearchComponent');
    this.query = this.route.snapshot.params['query'];  
  }

  fetchSearchNews(page: number = 1) {
    this.splashService.updateSplashState(true);
    // setTimeout(() =>this.splashService.updateSplashState(true), 0);
  	this.apiService.getSearchResults(this.query)
                   .subscribe( async (data)=>{
                     for (let news of data['hits']['hits']) {
                       this.searchResults.push(news['_source']);
                      }
                      this.searchResults = await this.commonFunctionsService.addSavedArticlesDetailsToNews(
                        this.user.email, this.user.provider, this.pageName,
                        this.searchResults);
                      this.splashService.updateSplashState(false);
                      // setTimeout(() =>this.splashService.updateSplashState(false), 200);
                    },
                    (error) => {
                      console.log(error);
                      this.searchResults = [];
                      this.splashService.updateSplashState(false);
                      // setTimeout(() =>this.splashService.updateSplashState(false), 200);
                    });
  }

  async saveSearchNews(newsId: string) {
    let response = await this.apiService.saveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async unsaveSearchNews(newsId: string) {
    let response = await this.apiService.unSaveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async saveSearchNewsSentiment(newsId: string, sentiment: string) {
    let response = await this.apiService.saveSentiment(
      this.user.email, this.user.provider, newsId, sentiment).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

}
