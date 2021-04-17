import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import { 
  FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser 
} from "angularx-social-login";

import { ApiService } from '../../api.service';
import { SplashService } from '../../splash.service';

export class SubscriptionForm {
  public email: string;
}

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
  @Input() maxPages: number;
  @Input() query = '';
  @Input() source = '';
  @Output() getArticlesForCurrentPage: EventEmitter<any> = new EventEmitter();
  @Output() saveNews: EventEmitter<any> = new EventEmitter();
  @Output() unSaveNews: EventEmitter<any> = new EventEmitter();
  @Output() saveSentiment: EventEmitter<any> = new EventEmitter();
  closeResult: string;
  currentPage: number = 1;
  linkToShare: string;
  titleToShare: string;
  modalOptions:NgbModalOptions;
  preferences: object;
  showSplash: boolean = true;
  subscriptionModel = new SubscriptionForm();
  subscriptionFormSubmitted: boolean = false;
  user: SocialUser;

  constructor(
    private apiService: ApiService, private authService: SocialAuthService,
    private modalService: NgbModal, private splashService:SplashService) {
      this.authService.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);
        if (this.loggedIn) {
          /**
           * Updates user info if the user already exists.
           */
          this.apiService.saveUser(user).subscribe((data) => {
            let userInfo = data['user'];
            if (userInfo.hasOwnProperty('preferences')) {
              this.preferences = userInfo['preferences'];
            }
          });
          this.modalService.dismissAll('User logged in successfully.');
        }
      });
      /**
       * Define options for auth modal (login overlay).
       */
      this.modalOptions = {
        ariaLabelledBy: 'modal-basic-title',
        backdropClass:'customBackdrop',
        centered: true,
      }
    }

  ngOnInit(): void {
    this.splashService.getSplashState().subscribe(
      splashState => {
        this.showSplash = splashState;
      }
    );
  }

  displaySubscriptionForm(subscribeFreeModal): void {
    this.modalService.open(subscribeFreeModal, this.modalOptions).result.then(
      (result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getPercentageStyle(percentage: number): string {
    var percentage:number = Math.round(percentage * 100);
    return `--percent:${ percentage };`;
  }

  getPreviousArticles() {
    this.currentPage--;
    if (this.currentPage == 0) {
      this.currentPage = 1;
    }
    this.getArticlesForCurrentPage.emit([this.currentPage]);
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
    setTimeout(() =>this.splashService.updateSplashState(false), 100);
  }

  private getDismissReason(reason: any): string {
    this.subscriptionFormSubmitted = false;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  getNextArticles() {
    this.currentPage++;
    if (this.currentPage > this.maxPages) {
      this.currentPage = this.maxPages;  
    }
    this.getArticlesForCurrentPage.emit([this.currentPage]);
  }

  saveUserSentiment(newsUrl: string, sentiment: string, loginModal): void {
    if (!this.loggedIn) {
      this.modalService.open(loginModal, this.modalOptions).result.then(
        (result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      console.log('closeResult saveUserSentiment==> ', this.closeResult);
    } else {
      this.saveSentiment.emit([newsUrl, sentiment]);
    }
  }

  saveUserNews(news, loginModal): void {
    if (!this.loggedIn) {
      this.modalService.open(loginModal, this.modalOptions).result.then(
        (result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      console.log('closeResult saveUserNews==> ', this.closeResult);
    } else {
      this.saveNews.emit([news['url']]);
      news['savedArticle'] = true;
    }
  }

  shareThisArticle(news, linkShareModal): void {
    if (this.source == 'news-article') {
      this.linkToShare = window.location.href;
    } else {
      this.linkToShare = 
        window.location.origin + '/news-article/' + news.slug + '/' +
        this.source;
    }
    this.titleToShare = news.title;
    this.modalService.open(linkShareModal, this.modalOptions).result.then(
      (result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    console.log('shareThisArticle closeResult==> ', this.closeResult);
  }

  subscribeUser(form): void {
    this.apiService.subscribeUser(form.value).subscribe((data) => {
      form.resetForm();
      this.subscriptionFormSubmitted = true;
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  unSaveUserNews(news): void {
    this.unSaveNews.emit([news['url']]);
    news['savedArticle'] = false;
  }

}
