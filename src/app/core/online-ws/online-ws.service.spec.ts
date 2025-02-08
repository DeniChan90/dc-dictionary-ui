import { TestBed } from '@angular/core/testing';

import { OnlineWsService } from './online-ws.service';

describe('OnlineWsService', () => {
  let service: OnlineWsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineWsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
