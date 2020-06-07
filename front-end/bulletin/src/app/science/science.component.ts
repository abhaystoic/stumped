import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-science',
  templateUrl: './science.component.html',
  styleUrls: ['./science.component.css', '../global.css']
})
export class ScienceComponent implements OnInit {

  scienceNews;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getScienceNews().subscribe((data)=>{
      this.scienceNews = data['articles'];
    });
  }

}
