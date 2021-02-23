import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-science',
  templateUrl: './science.component.html',
  styleUrls: ['./science.component.css', '../global.css']
})
export class ScienceComponent implements OnInit {

  scienceNews;
  constructor(private apiService: ApiService, private splashService:SplashService) { }

  ngOnInit(): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.apiService.getScienceNews().subscribe((data)=>{
      this.scienceNews = data['articles'];
      setTimeout(() =>this.splashService.updateSplashState(false), 200);
    });
  }

}
