import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css', '../global.css']
})
export class BusinessComponent implements OnInit {

  businessNews;
  constructor(private apiService: ApiService, private splashService:SplashService) { }

  ngOnInit(): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.apiService.getBusinessNews().subscribe((data)=>{
      this.businessNews = data['articles'];
      setTimeout(() =>this.splashService.updateSplashState(false), 300);
    });
  }

}
