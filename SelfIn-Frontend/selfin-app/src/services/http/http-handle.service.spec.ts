import { TestBed } from '@angular/core/testing';

import { HttpHandleService } from './http-handle.service';

describe('HttpHandleService', () => {
  let service: HttpHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
