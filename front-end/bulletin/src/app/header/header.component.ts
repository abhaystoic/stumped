import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  searchResults: object = [];
  searchInput: string = '';

  constructor(
    private apiService: ApiService, private router: Router){}

  ngOnInit(): void {
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
    });
  }

  showAllSearchResults():void {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(
      ()=>this.router.navigate(['/search/' + this.searchInput]));
  }

}
