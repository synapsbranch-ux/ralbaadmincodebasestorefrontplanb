import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusChangeReturnComponent } from './order-status-change-return.component';

describe('OrderStatusChangeReturnComponent', () => {
  let component: OrderStatusChangeReturnComponent;
  let fixture: ComponentFixture<OrderStatusChangeReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderStatusChangeReturnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatusChangeReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
