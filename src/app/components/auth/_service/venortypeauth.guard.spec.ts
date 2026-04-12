import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { venortypeauthGuard } from './venortypeauth.guard';

describe('venortypeauthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => venortypeauthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
