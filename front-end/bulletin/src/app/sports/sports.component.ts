import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css', '../global.css']
})
export class SportsComponent implements OnInit {

  sportsNews;
  constructor(private apiService: ApiService, private splashService:SplashService) { }

  ngOnInit(): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.apiService.getSportsNews().subscribe((data)=>{
      this.sportsNews = data['articles'];
      setTimeout(() =>this.splashService.updateSplashState(false), 300);
    });
  }

}
