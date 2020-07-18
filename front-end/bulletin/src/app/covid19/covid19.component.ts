import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.css', '../global.css']
})
export class Covid19Component implements OnInit {
  covid19News;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCovid19News().subscribe((data)=>{
      this.covid19News = data['articles'];
    });
  }

}

