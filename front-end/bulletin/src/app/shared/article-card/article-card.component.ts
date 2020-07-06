import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css', '../../global.css']
})
export class ArticleCardComponent implements OnInit {

  @Input() allArticles;
  @Input() allOriginalArticles;
  @Input() displayPositiveNews = false;
  constructor() { }

  ngOnInit(): void {
    this.allOriginalArticles = this.allArticles;
  }

  getPercentageStyle(percentage: number): string {
    var percentage:number = Math.round(percentage * 100);
    return `--percent:${ percentage };`;
  }

  filterNews() {
    this.displayPositiveNews = !this.displayPositiveNews;
    if(this.displayPositiveNews) {
      this.allArticles = this.allOriginalArticles.filter(
        news => news.negativity <= 8 || !news.negativity);
    } else {
      this.allArticles = this.allOriginalArticles;
    }
  }

}
