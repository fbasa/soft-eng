import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { dirtyGuard } from './dirty-guard';

describe('dirtyGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dirtyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
