import { TestBed } from '@angular/core/testing';

import { EventMapperService } from './event-mapper.service';

describe('EventParserService', () => {
  let service: EventMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
