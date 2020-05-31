import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openNav():void {
    document.getElementById("appSidenav").style.width = "150px";
    document.getElementById("main").style.marginLeft = "150px";
    document.getElementById("main").style.width = "90%";
  }

}
