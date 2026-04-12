import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnDurationComponent } from './return-duration.component';

describe('ReturnDurationComponent', () => {
  let component: ReturnDurationComponent;
  let fixture: ComponentFixture<ReturnDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnDurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
