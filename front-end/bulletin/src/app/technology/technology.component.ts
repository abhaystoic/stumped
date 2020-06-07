import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css', '../global.css']
})
export class TechnologyComponent implements OnInit {
  technologyNews;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getTechnologyNews().subscribe((data)=>{
      this.technologyNews = data['articles'];
    });
  }

}
