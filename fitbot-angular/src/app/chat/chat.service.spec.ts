import {TestBed} from '@angular/core/testing'

import {ChatService} from './chat.service'
import { HttpClientModule } from '@angular/common/http';

describe('ChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }))

  it('should be created', () => {
    const service: ChatService = TestBed.get(ChatService)
    expect(service).toBeTruthy()
  })
})
