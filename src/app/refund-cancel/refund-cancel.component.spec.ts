import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundCancelComponent } from './refund-cancel.component';

describe('RefundCancelComponent', () => {
  let component: RefundCancelComponent;
  let fixture: ComponentFixture<RefundCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
