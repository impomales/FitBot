import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormsComponent } from './auth-forms.component';

describe('AuthFormsComponent', () => {
  let component: AuthFormsComponent;
  let fixture: ComponentFixture<AuthFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
