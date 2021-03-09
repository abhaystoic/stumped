import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SplashService } from '../../splash.service';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css', '../../global.css']
})
export class ArticleCardComponent implements OnInit {

  @Input() allArticles;
  @Input() allOriginalArticles;
  @Input() displayPositiveNews = false;
  @Input() loggedIn;
  @Input() source = '';
  @Input() query = '';
  @Output() saveNews: EventEmitter<any> = new EventEmitter();
  @Output() unSaveNews: EventEmitter<any> = new EventEmitter();
  showSplash = true;

  constructor(private splashService:SplashService) { }

  ngOnInit(): void {
    this.splashService.getSplashState().subscribe(
      splashState => {
        this.showSplash = splashState;
      }
    );
  }

  getPercentageStyle(percentage: number): string {
    var percentage:number = Math.round(percentage * 100);
    return `--percent:${ percentage };`;
  }

  filterNews() {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
    this.displayPositiveNews = !this.displayPositiveNews;
    if(this.displayPositiveNews) {
      this.allOriginalArticles = this.allArticles;
      this.allArticles = this.allOriginalArticles.filter(
        news => Math.round(news.negativity * 100) < 8 || !news.negativity);
    } else {
      this.allArticles = this.allOriginalArticles;
    }
    setTimeout(() =>this.splashService.updateSplashState(false), 200);
  }

  saveUserNews(news): void {
    console.log('saveUserNews==>', news);
    this.saveNews.emit([news['url']]);
    news['savedArticle'] = true;
  }

  unSaveUserNews(news): void {
    console.log('unSaveUserNews==>', news);
    this.unSaveNews.emit([news['url']]);
    news['savedArticle'] = false;
  }

}
