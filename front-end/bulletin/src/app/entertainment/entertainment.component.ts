import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-entertainment',
  templateUrl: './entertainment.component.html',
  styleUrls: ['./entertainment.component.css', '../global.css']
})
export class EntertainmentComponent implements OnInit {

  entertainmentNews;
  constructor(private apiService: ApiService, private splashService:SplashService) { }

  ngOnInit(): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.apiService.getEntertainmentNews().subscribe((data)=>{
      this.entertainmentNews = data['articles'];
      setTimeout(() =>this.splashService.updateSplashState(false), 1000);
    });
  }

}
