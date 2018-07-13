import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurNetworkComponent } from './our-network.component';

describe('OurNetworkComponent', () => {
  let component: OurNetworkComponent;
  let fixture: ComponentFixture<OurNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
