import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-entertainment',
  templateUrl: './entertainment.component.html',
  styleUrls: ['./entertainment.component.css', '../global.css']
})
export class EntertainmentComponent implements OnInit {

  entertainmentNews;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getEntertainmentNews().subscribe((data)=>{
      this.entertainmentNews = data['articles'];
    });
  }

}
