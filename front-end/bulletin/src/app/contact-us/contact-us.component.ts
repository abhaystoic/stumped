import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ApiService } from '../api.service';
import { SplashService } from '../splash.service';

export class FeedbackForm {
  public name: string;
  public email: string;
  public message: string;
  public mobile: string;
}


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css', '../global.css']
})
export class ContactUsComponent implements OnInit {

  feedbackModel = new FeedbackForm();
  formSubmitted: boolean = false;
  mobNumberPattern: string = '^((\\+91-?)|0)?[0-9]{10}$';

  constructor(
    private apiService: ApiService, private splashService: SplashService,
    public title: Title) {
      this.title.setTitle('iBot News | Contact Us');
    }

  ngOnInit(): void {
  }

  saveFeedback(form): void {
    setTimeout(() =>this.splashService.updateSplashState(true), 0);
  	this.apiService.saveFeedback(form.value).subscribe((data) => {
      setTimeout(() =>this.splashService.updateSplashState(false), 200);
      form.resetForm();
      this.formSubmitted = true;
    });
  }

}
