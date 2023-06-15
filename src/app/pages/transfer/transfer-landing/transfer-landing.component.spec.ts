import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferLandingComponent } from './transfer-landing.component';

describe('TransferLandingComponent', () => {
  let component: TransferLandingComponent;
  let fixture: ComponentFixture<TransferLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
