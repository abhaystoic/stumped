import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css', '../global.css']
})
export class HealthComponent implements OnInit {

  healthNews;
  constructor(private apiService: ApiService, private splashService:SplashService) { }

  ngOnInit(): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.apiService.getHealthNews().subscribe((data)=>{
      this.healthNews = data['articles'];
      setTimeout(() =>this.splashService.updateSplashState(false), 200);
    });
  }

}
