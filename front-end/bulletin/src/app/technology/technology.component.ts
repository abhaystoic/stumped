import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css', '../global.css']
})
export class TechnologyComponent implements OnInit {
  technologyNews;
  displayPositiveNews;
  showSplash: boolean = true;

  constructor(private apiService: ApiService, private splashService:SplashService) { }

  ngOnInit(): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.apiService.getTechnologyNews().subscribe((data) => {
      this.technologyNews = data['articles'];
      setTimeout(() =>this.splashService.updateSplashState(false), 200);
    });
  }

}
