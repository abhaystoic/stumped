import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css', '../../global.css']
})
export class ArticleCardComponent implements OnInit {

  @Input() allArticles;
  constructor() { }

  ngOnInit(): void {
  }

}
