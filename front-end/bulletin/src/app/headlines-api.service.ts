import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeadlinesApiService {

  constructor(private httpClient: HttpClient) { }

  public getHeadlines() {
  	return this.httpClient.get('http://172.22.0.3:5000');
  }
}
