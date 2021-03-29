import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { SocialAuthService, SocialUser } from "angularx-social-login";

import { ApiService } from '../api.service';
import { CommonFunctionsService } from '../common-functions.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-news-article',
  templateUrl: './news-article.component.html',
  styleUrls: ['./news-article.component.css', '../global.css']
})
export class NewsArticleComponent implements OnInit {

  newsArticle;
  slug: string;
  source: string;
  loggedIn: boolean;
  pageName: string = 'news-article';
  showSplash: boolean = true;
  user: SocialUser;
  constructor(
    private apiService: ApiService,
    private authService: SocialAuthService,
    private commonFunctionsService: CommonFunctionsService,
    private route: ActivatedRoute, private splashService: SplashService,
    public title: Title) {
      this.slug = this.route.snapshot.params['slug'];
      this.source = this.route.snapshot.params['source'];
      this.authService.authState.subscribe(user => {
        this.user = user;
        this.loggedIn = (user != null);
        this.fetchNewsArticle();
      });
    }

  ngOnInit(): void {}

  fetchNewsArticle(): void {
    this.splashService.updateSplashState(true);
    this.apiService.getNewsArticle(this.slug, this.source).subscribe( async (data) => {
      data = new Array(data)
      if (this.user) {
        // Add articles that were saved by the user earlier.
        this.newsArticle = 
          await this.commonFunctionsService.addSavedArticlesDetailsToNews(
            this.user.email, this.user.provider, this.pageName, data);
      } else {
        data[0]['savedArticle'] = false;
        this.newsArticle = data;
      }
      if (this.newsArticle.length > 0) {
        this.title.setTitle('iBot News | ' + this.newsArticle[0].title);
      }
      this.splashService.updateSplashState(false);
    });
  }

  async saveNewsArticle(newsId: string) {
    let response = await this.apiService.saveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async unSaveNewsArticle(newsId: string) {
    let response = await this.apiService.unSaveNews(
      this.user.email, this.user.provider, newsId).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

  async saveNewsArticleSentiment(newsId: string, sentiment: string) {
    let response = await this.apiService.saveSentiment(
      this.user.email, this.user.provider, newsId, sentiment).toPromise();
    if (response['success']) {
      return true;
    }
    return false;
  }

}
