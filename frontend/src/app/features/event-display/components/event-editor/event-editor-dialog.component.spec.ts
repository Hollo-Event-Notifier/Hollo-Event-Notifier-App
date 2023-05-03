import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEditorDialogComponent } from './event-editor-dialog.component';

describe('EventEditorComponent', () => {
  let component: EventEditorDialogComponent;
  let fixture: ComponentFixture<EventEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventEditorDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
