import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferBaseComponent } from './transfer-base.component';

describe('TransferBaseComponent', () => {
  let component: TransferBaseComponent;
  let fixture: ComponentFixture<TransferBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
