import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnListVendorComponent } from './return-list-vendor.component';

describe('ReturnListVendorComponent', () => {
  let component: ReturnListVendorComponent;
  let fixture: ComponentFixture<ReturnListVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnListVendorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnListVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
