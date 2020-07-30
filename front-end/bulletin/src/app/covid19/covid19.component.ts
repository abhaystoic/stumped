import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.css', '../global.css']
})
export class Covid19Component implements OnInit {
  covid19News;

  constructor(private apiService: ApiService, private splashService:SplashService) {}

  ngOnInit(): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.apiService.getCovid19News().subscribe((data)=>{
      this.covid19News = data['articles'];
      setTimeout(() =>this.splashService.updateSplashState(false), 300);
    });
  }

}

