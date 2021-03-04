import { Component, OnInit } from '@angular/core';

import { SocialAuthService, SocialUser } from "angularx-social-login";
import {
  FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

import { ApiService } from '../api.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css', '../global.css']
})
export class MyProfileComponent implements OnInit {

  user: SocialUser;
  loggedIn: boolean;
  preferences: object;

  constructor(
    private apiService: ApiService, private authService: SocialAuthService) {
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
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log("MyProfileComponent===>", user);
      this.apiService.saveUserInfo(user);
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
    console.log("savePreferences===>>", this.preferences);
    this.user['preferences'] = this.preferences;
    this.apiService.saveUserInfo(this.user);
  }

}
