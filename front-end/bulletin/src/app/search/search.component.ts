import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css', '../global.css']
})
export class SearchComponent implements OnInit {

  searchResults: Array<object> = [];

  constructor(
    private apiService: ApiService, private splashService:SplashService,
    private route:ActivatedRoute) {
      console.log('in constructor');
    }

  ngOnInit(): void {
    console.log('in ngOnInit');
    let query = this.route.snapshot.params['query'];
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.apiService.getSearchResults(query).subscribe((data)=>{
      for (let news of data['hits']['hits']) {
        this.searchResults.push(news['_source']);
      }
      setTimeout(() =>this.splashService.updateSplashState(false), 300);
    });
  }

}
