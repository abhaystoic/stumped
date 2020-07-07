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

  constructor(private splashService:SplashService) {
    this.splashService.getSplashState().subscribe(
      splashState => {
        this.showSplash = splashState;
      }
    )
  }
}
