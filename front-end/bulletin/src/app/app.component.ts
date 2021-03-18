import { Component } from '@angular/core';
import { SplashService } from './splash.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'bulletin';
  showSplash: boolean = false;

  constructor(private splashService:SplashService) { }

  ngOnInit(): void {
    this.splashService.getSplashState().subscribe(
      splashState => {
        this.showSplash = splashState;
      }
    );
  }

  onActivate(): void {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }
}
