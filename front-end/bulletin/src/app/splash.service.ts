import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplashService {
  private showSplash:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  getSplashState() {
    return this.showSplash.asObservable();
  }

  updateSplashState(state: boolean) {
    this.showSplash.next(state);
  }
}
