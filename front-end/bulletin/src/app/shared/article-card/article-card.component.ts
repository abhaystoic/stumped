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

  getPercentageStyle(percentage: number): string {
    var percentage:number = Math.round(percentage * 100);
    return `--percent:${ percentage };`;
  }

}
