import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { 
  FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser 
} from "angularx-social-login";

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css', '../global.css']
})
export class MyProfileComponent implements OnInit {

  hideEverythingUntilVerified: boolean;
  loggedIn: boolean;
  preferences: object;
  user: SocialUser;

  constructor(
    private apiService: ApiService, private authService: SocialAuthService,
    private splashService:SplashService, public title: Title) {
      this.title.setTitle('iBot News | My Profile');
      this.preferences = {
        "activist": false,
        "adventure": false,
        "arts": false,
        "automobiles": false,
        "culture": false,
        "economics": false,
        "entertainment": false,
        "environmental": false,
        "faith": false,
        "games": false,
        "health": false,
        "international": false,
        "investmets": false,
        "jobs": false,
        "local": false,
        "national": false,
        "politics": false,
        "science": false,
        "sports": false,
        "technology": false,
        "travel": false,
        "weather": false,
      }
    }

  ngOnInit(): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.hideEverythingUntilVerified = true;
    this.authService.authState.subscribe((user) => {
      setTimeout(() =>this.splashService.updateSplashState(false), 0);
      this.user = user;
      this.loggedIn = (user != null);
      this.hideEverythingUntilVerified = false;
      console.log("MyProfileComponent===>", user);
      if (this.loggedIn) {
        /**
         * Updates user info if the user already exists.
         */
        this.apiService.saveUser(user).subscribe((data) => {
          let userInfo = data['user'];
          if (userInfo.hasOwnProperty('preferences')) {
            this.preferences = userInfo['preferences'];
          }
        });
      }
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  savePreferences(category, pref): void {
    this.preferences[category] = pref;
    this.user['preferences'] = this.preferences;
    console.log("savePreferences===>>", this.user);
    this.apiService.saveUser(this.user).subscribe((data)=>{
      console.log(data);
    });
  }

}
