import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.css']
})
export class Covid19Component implements OnInit {
  covid19News;

  constructor(private apiService: ApiService) { console.log('constructor');}

  ngOnInit(): void {
    console.log('init');
  	this.apiService.getCovid19News().subscribe((data)=>{
      console.log(data['articles']);
      this.covid19News = data['articles'];
    });
  }

}

