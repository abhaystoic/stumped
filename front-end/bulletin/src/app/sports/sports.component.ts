import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css', '../global.css']
})
export class SportsComponent implements OnInit {

  sportsNews;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getSportsNews().subscribe((data)=>{
      this.sportsNews = data['articles'];
    });
  }

}
