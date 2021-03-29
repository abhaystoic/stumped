import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css', '../global.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(public title: Title) {
    this.title.setTitle('iBot News | Page Not Found - 404');
  }

  ngOnInit(): void {
  }

}
