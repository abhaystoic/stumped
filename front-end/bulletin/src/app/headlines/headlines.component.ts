import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-headlines',
  templateUrl: './headlines.component.html',
  styleUrls: ['./headlines.component.css', '../global.css']
})
export class HeadlinesComponent implements OnInit {
  headlines;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  	this.apiService.getHeadlines().subscribe((data)=>{
      this.headlines = data['articles'];
    });
  }

}
