import { Component, OnInit } from '@angular/core';

import { HeadlinesApiService } from '../headlines-api.service';

@Component({
  selector: 'app-headlines',
  templateUrl: './headlines.component.html',
  styleUrls: ['./headlines.component.css']
})
export class HeadlinesComponent implements OnInit {
  headlines;

  constructor(private headlinesApiService: HeadlinesApiService) { }

  ngOnInit(): void {
  	this.headlinesApiService.getHeadlines().subscribe((data)=>{
      console.log(data['articles']);
      this.headlines = data['articles'];
    });
  }

}
