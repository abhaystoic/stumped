import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

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
    private splashService: SplashService, public title: Title) {
      this.title.setTitle('iBot News | Search Results');
      this.query = this.route.snapshot.params['query'];
      this.authService.authState.subscribe(user => {
        this.user = user;
        this.loggedIn = (user != null);
        this.fetchSearchNews();
      });
  }

  ngOnInit(): void {}

  fetchSearchNews(page: number = 1) {
    this.splashService.updateSplashState(true);
    // setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.apiService.getSearchResults(this.query).subscribe( async (data) => {
      for (let news of data['hits']['hits']) {
        this.searchResults.push(news['_source']);
      }
      if (this.user) {
        // Add articles that were saved by the user earlier.
        this.searchResults = 
          await this.commonFunctionsService.addSavedArticlesDetailsToNews(
            this.user.email, this.user.provider, this.pageName,
            this.searchResults);
      } else {
        this.searchResults.forEach((article, index) => {
          this.searchResults[index]['savedArticle'] = false;
        });
      }
      /**
       * Works for all practical purposes.
       * TODO: Sort the results from Elasticsearch engine by the
       * 'publishedAt' property.
       */
      this.searchResults = this.searchResults.reverse()
      // TODO: Implement pagination for search results.
      this.maxPages = 1;//data['max_pages'];
      // setTimeout(() =>this.splashService.updateSplashState(false), 200);
      this.splashService.updateSplashState(false);
    },
    (error) => {
      console.log(error);
      this.searchResults = [];
      this.splashService.updateSplashState(false);
      // setTimeout(() =>this.splashService.updateSplashState(false), 200);
    });
  }

  async saveSearchNews(newsId: string) {
    if (this.user) {
      let response = await this.apiService.saveNews(
        this.user.email, this.user.provider, newsId).toPromise();
      if (response['success']) {
        return true;
      }
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
