import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionsService {

  constructor(private apiService: ApiService,) { }

  public getNewsIDs(newsArticles) {
    return newsArticles.map(article => article.url);
  }

  public async addSavedArticlesDetailsToNews(
    email, provider, pageName, newsArticles) {
    let headlinesIds = this.getNewsIDs(newsArticles);
    /**
     * Get user's saved news, reactions etc.
     */
    let response = await this.apiService.getSavedNewsAndSentiments(
      email, provider, headlinesIds, pageName, newsArticles['_id']).toPromise();
    console.log('response===>', response);
    let savedNewsArticlesIds = [];
    let savedNewsSentiments = {};
    if (response['success']) {
      savedNewsArticlesIds = response['saved_news_ids'];
      savedNewsSentiments = response['saved_news_sentiments'];
    }
    newsArticles.forEach((article, index) => {
      newsArticles[index]['savedArticle'] = false;
      newsArticles[index]['sentiment'] = savedNewsSentiments[article['url']];
      if (savedNewsArticlesIds.includes(article['url'])) {
        newsArticles[index]['savedArticle'] = true;
      }
    });
    console.log('newsArticles===', newsArticles);
    return newsArticles;
  }

}
