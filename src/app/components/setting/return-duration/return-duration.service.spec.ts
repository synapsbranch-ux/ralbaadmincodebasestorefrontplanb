import { TestBed } from '@angular/core/testing';

import { ReturnDurationService } from './return-duration.service';

describe('ReturnDurationService', () => {
  let service: ReturnDurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnDurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
