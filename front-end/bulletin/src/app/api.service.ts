import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  public getBusinessNews() {
  	return this.httpClient.get('http://localhost:5000/business');
  }

  public getCovid19News() {
  	console.log('getCovid19News');
  	return this.httpClient.get('http://172.22.0.3:5000');
  }

  public getEntertainmentNews() {
  	return this.httpClient.get('http://localhost:5000/entertainment');
  }

  public getHeadlines() {
  	return this.httpClient.get('http://172.22.0.4:5000');
  }

  public getHealthNews() {
  	return this.httpClient.get('http://localhost:5000/health');
  }

  public getScienceNews() {
  	return this.httpClient.get('http://localhost:5000/science');
  }

  public getSportsNews() {
  	return this.httpClient.get('http://localhost:5000/sports');
  }

  public getTechnologyNews() {
  	return this.httpClient.get('http://localhost:5000/technology');
  }

}
