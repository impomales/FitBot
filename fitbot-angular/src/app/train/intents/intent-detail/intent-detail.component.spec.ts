import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentDetailComponent } from './intent-detail.component';

describe('IntentDetailComponent', () => {
  let component: IntentDetailComponent;
  let fixture: ComponentFixture<IntentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
