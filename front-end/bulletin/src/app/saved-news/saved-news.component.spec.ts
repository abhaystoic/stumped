import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedNewsComponent } from './saved-news.component';

describe('SavedNewsComponent', () => {
  let component: SavedNewsComponent;
  let fixture: ComponentFixture<SavedNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
