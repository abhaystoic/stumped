import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-headlines',
  templateUrl: './headlines.component.html',
  styleUrls: ['./headlines.component.css']
})
export class HeadlinesComponent implements OnInit {
  headlines;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  	this.apiService.getHeadlines().subscribe((data)=>{
      console.log(data['articles']);
      this.headlines = data['articles'];
    });
  }

}
