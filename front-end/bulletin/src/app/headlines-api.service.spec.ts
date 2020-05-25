import { TestBed } from '@angular/core/testing';

import { HeadlinesApiService } from './headlines-api.service';

describe('HeadlinesApiService', () => {
  let service: HeadlinesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeadlinesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
