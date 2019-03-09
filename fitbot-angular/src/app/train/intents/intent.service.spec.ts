import { TestBed } from '@angular/core/testing';

import { IntentService } from './intent.service';

describe('IntentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntentService = TestBed.get(IntentService);
    expect(service).toBeTruthy();
  });
});
