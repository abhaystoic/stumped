import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css', '../global.css']
})
export class HealthComponent implements OnInit {

  healthNews;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getHealthNews().subscribe((data)=>{
      this.healthNews = data['articles'];
    });
  }

}
