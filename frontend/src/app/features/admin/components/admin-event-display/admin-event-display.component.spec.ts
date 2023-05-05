import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventDisplayComponent } from './admin-event-display.component';

describe('AdminEventDisplayComponent', () => {
  let component: AdminEventDisplayComponent;
  let fixture: ComponentFixture<AdminEventDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEventDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEventDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
