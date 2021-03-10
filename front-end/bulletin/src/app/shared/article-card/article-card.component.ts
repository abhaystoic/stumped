import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import { 
  FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser 
} from "angularx-social-login";

import { ApiService } from '../../api.service';
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
  @Output() saveSentiment: EventEmitter<any> = new EventEmitter();
  showSplash = true;
  preferences: object;
  user: SocialUser;
  closeResult: string;
  modalOptions:NgbModalOptions;

  constructor(
    private apiService: ApiService, private authService: SocialAuthService,
    private modalService: NgbModal, private splashService:SplashService) {
      this.authService.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);
        console.log("ArticleCardComponent user===>", user);
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  saveUserSentiment(newsUrl: string, sentiment: string, loginModal): void {
    console.log('saveUserSentiment==>', sentiment);
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
    console.log('saveUserNews==>', news);
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

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  unSaveUserNews(news): void {
    console.log('unSaveUserNews==>', news);
    this.unSaveNews.emit([news['url']]);
    news['savedArticle'] = false;
  }

}
