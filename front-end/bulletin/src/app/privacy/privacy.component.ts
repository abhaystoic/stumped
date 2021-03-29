import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css', '../global.css']
})
export class PrivacyComponent implements OnInit {

  constructor(public title: Title) {
    this.title.setTitle('iBot News | Privacy Policy');
  }

  ngOnInit(): void {
  }

}
