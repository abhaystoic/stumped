import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css', '../global.css']
})
export class AboutUsComponent implements OnInit {

  constructor(public title: Title) {
    this.title.setTitle('iBot News | About Us');
  }

  ngOnInit(): void {
  }

}
