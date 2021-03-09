import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  public getBusinessNews() {
    return this.httpClient.get('/fetch-business');
  }

  public getCovid19News() {
    return this.httpClient.get('/fetch-covid19');
  }

  public getEntertainmentNews() {
    return this.httpClient.get('/fetch-entertainment');
  }

  public getHeadlines() {
  	return this.httpClient.get('http://localhost/fetch-headlines');
  }

  public getHealthNews() {
    return this.httpClient.get('/fetch-health');
  }

  public getScienceNews() {
    return this.httpClient.get('/fetch-science');
  }

  public getSportsNews() {
    return this.httpClient.get('/fetch-sports');
  }

  public getTechnologyNews() {
    return this.httpClient.get('/fetch-technology');
  }

  public getSavedNewsAndSentiments(
    email: string, provider: string, newsArticleIds: string[],
    pageName: string, newsId: string) {
    let headers = {
      'Content-Type': 'application/json',
    }
    let body = {
      'email': email,
      'news-article-ids': newsArticleIds,
      'news-id': newsId,
      'provider': provider,
      'page-name': pageName,
    }
    return this.httpClient.post<any>(
      '/get-saved-news-and-sentiments', body, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to get saved news for the user.');
        }));
  }

  public getSearchResults(query) {
    let body = {
      'query': {
        'match_phrase_prefix' : {
          'title': {
            'query': query,
            'slop': 3,
            'max_expansions': 10,
          }
        }
      },
      '_source': [
        'title', 'description', 'content', 'source', 'url', 'urlToImage',
        'positivity', 'negativity', 'neutrality'],
    };
    let headers = {
      'Content-Type': 'application/json',
    }
    return this.httpClient.post<any>(
      '/search-news', body, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Elastic Search MS returned no results.');
        }));
  }

  public saveNews(
    email: string, provider: string, newsId: string) {
    let headers = {
      'Content-Type': 'application/json',
    }
    let body = {
      'email': email,
      'news-article-id': newsId,
      'provider': provider,
    }
    return this.httpClient.post<any>(
      '/save-news', body, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to save news for the user.');
        }));
  }

  public saveSentiment(
    email: string, provider: string, newsId: string, sentiment: string) {
    let headers = {
      'Content-Type': 'application/json',
    }
    let body = {
      'email': email,
      'news-article-id': newsId,
      'provider': provider,
      'sentiment': sentiment,
    }
    return this.httpClient.post<any>(
      '/save-sentiments', body, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to save news for the user.');
        }));
  }

  public unSaveNews(
    email: string, provider: string, newsId: string) {
    let headers = {
      'Content-Type': 'application/json',
    }
    let body = {
      'email': email,
      'provider': provider,
      'news-article-id': newsId,
    }
    return this.httpClient.post<any>(
      '/unsave-news', body, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to unsave news for the user.');
        }));
  }

  public saveUser(user) {
    let headers = {
      'Content-Type': 'application/json',
    }
    return this.httpClient.post<any>(
      '/save-user', user, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to save user info.');
        }));
  }

}
