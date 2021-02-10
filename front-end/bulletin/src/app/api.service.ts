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
  	return this.httpClient.get('/fetch-headlines');
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
      'http://172.18.0.6:9200/news-search/news/_search', body, {headers}).pipe(
        catchError(err => {
          console.log(err);
          return throwError('Elastic Search MS returned no results.');
        }));
  }

}
