import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreatorDialogComponent } from './user-creator-dialog.component';

describe('UserCreatorDialogComponent', () => {
  let component: UserCreatorDialogComponent;
  let fixture: ComponentFixture<UserCreatorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCreatorDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCreatorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
