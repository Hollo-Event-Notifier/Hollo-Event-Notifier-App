import { TestBed } from '@angular/core/testing';

import { SettingsGuardService } from './settings-guard.service';

describe('SettingsGuardService', () => {
  let service: SettingsGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
