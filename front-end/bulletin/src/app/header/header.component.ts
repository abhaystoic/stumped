import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

import { SocialAuthService, SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedIn: boolean = false;
  searchResults: object = [];
  searchInput: string = '';
  user: SocialUser;

  constructor(
    private apiService: ApiService, private router: Router,
    private authService: SocialAuthService){}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  openNav():void {
    document.getElementById("appSidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "200px";
    document.getElementById("main").style.width = "85%";
  }

  search():void {
    this.apiService.getSearchResults(this.searchInput).subscribe((data)=>{
      console.log(data['hits']['hits']);
      this.searchResults = data['hits']['hits'];
    },
    (error) => {
      console.log(error);
      this.searchResults = null;
    });
  }

  showAllSearchResults():void {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(
      ()=>this.router.navigate(['/search/' + this.searchInput]));
  }

}
