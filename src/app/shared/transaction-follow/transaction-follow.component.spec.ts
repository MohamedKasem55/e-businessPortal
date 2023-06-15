import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFollowComponent } from './transaction-follow.component';

describe('TransactionFollowComponent', () => {
  let component: TransactionFollowComponent;
  let fixture: ComponentFixture<TransactionFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionFollowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
