import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css', '../global.css']
})
export class BusinessComponent implements OnInit {

  businessNews;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getBusinessNews().subscribe((data)=>{
      this.businessNews = data['articles'];
    });
  }

}
