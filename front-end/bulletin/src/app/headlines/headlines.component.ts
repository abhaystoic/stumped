import { Component, OnInit } from '@angular/core';

import { SocialAuthService, SocialUser } from "angularx-social-login";

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-headlines',
  templateUrl: './headlines.component.html',
  styleUrls: ['./headlines.component.css', '../global.css']
})
export class HeadlinesComponent implements OnInit {
  headlines;
  showSplash: boolean = true;
  user: SocialUser;
  loggedIn: boolean;

  constructor(
    private apiService: ApiService, private splashService:SplashService,
    private authService: SocialAuthService) {
      this.authService.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);
        console.log('HeadlinesComponent===========>', user);
      });
    }

  ngOnInit(): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
  	this.apiService.getHeadlines().subscribe((data)=>{
      this.headlines = data['articles'];
      setTimeout(() =>this.splashService.updateSplashState(false), 200);
    });
  }

}
