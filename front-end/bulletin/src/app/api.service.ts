import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  public getBusinessNews() {
    return this.httpClient.get('/fetch-business');
  }

  public getCovid19News() {
  	console.log('getCovid19News');
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

}
