import { TestBed } from '@angular/core/testing';
import { ApplicationStateService } from './application-state.service';

describe('ApplicationStateService', () => {
  let service: ApplicationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationStateService]
    });
    service = TestBed.inject(ApplicationStateService);
  });

  it('should be created', () => {
    // Arrange

    // Act

    // Assert
    expect(service).toBeTruthy();
  });
});
