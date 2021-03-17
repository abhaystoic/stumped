import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  public getBusinessNews(page: number = 1) {
    let params = new HttpParams(); //TODO: Initialize once, reset every time.
    params = params.append('page', page.toString());
    return this.httpClient.get<any>(
      'http://localhost/fetch-business', {params: params}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to get business news.');
        }));
  }

  public getCovid19News(page: number = 1) {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    return this.httpClient.get<any>(
      'http://localhost/fetch-covid19', {params: params}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to get covid19 news.');
        }));
  }

  public getEntertainmentNews(page: number = 1) {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    return this.httpClient.get<any>(
      'http://localhost/fetch-entertainment', {params: params}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to get entertainment news.');
        }));
  }

  public getHeadlines(page: number = 1) {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    return this.httpClient.get<any>(
      'http://localhost/fetch-headlines', {params: params}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to get headlines.');
        }));
  }

  public getHealthNews(page: number = 1) {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    return this.httpClient.get<any>(
      'http://localhost/fetch-health', {params: params}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to get health news.');
        }));
  }

  public getScienceNews(page: number = 1) {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    return this.httpClient.get<any>(
      'http://localhost/fetch-science', {params: params}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to get science news.');
        }));
  }

  public getSportsNews(page: number = 1) {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    return this.httpClient.get<any>(
      'http://localhost/fetch-sports', {params: params}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to get sports news.');
        }));
  }

  public getTechnologyNews(page: number = 1) {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    return this.httpClient.get<any>(
      'http://localhost/fetch-technology', {params: params}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to get technology news.');
        }));
  }

  public getSavedNewsArticles(
    email: string, provider: string, pageName: string) {
    let headers = {
      'Content-Type': 'application/json',
    }
    let body = {
      'email': email,
      'provider': provider,
      'page-name': pageName,
    }
    return this.httpClient.post<any>(
      'http://localhost/user/get-saved-news-articles', body, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to get saved news for the user.');
        }));
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
      'http://localhost/user/get-saved-news-and-sentiments', body, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError(
            'Failed to get saved news and sentiments for the user.');
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
      'http://localhost/search-news', body, {headers}).pipe(
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
      'http://localhost/user/save-news', body, {headers}).pipe(
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
      'http://localhost/user/save-sentiments', body, {headers}).pipe(
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
      'http://localhost/user/unsave-news', body, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to unsave news for the user.');
        }));
  }

  public saveFeedback(feedback) {
    let headers = {
      'Content-Type': 'application/json',
    }
    return this.httpClient.post<any>(
      'http://localhost/user/save-feedback', feedback, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to save user feedback.');
        }));
  }

  public saveUser(user) {
    let headers = {
      'Content-Type': 'application/json',
    }
    return this.httpClient.post<any>(
      'http://localhost/user/save-user', user, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Failed to save user info.');
        }));
  }

}
