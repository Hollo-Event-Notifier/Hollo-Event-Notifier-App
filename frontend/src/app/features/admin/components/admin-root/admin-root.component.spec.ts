import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {AdminRootComponent} from './admin-root.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {RouterTestingModule} from "@angular/router/testing";

describe('AdminRootComponent', () => {
  let component: AdminRootComponent;
  let fixture: ComponentFixture<AdminRootComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRootComponent],
      imports: [
        MatToolbarModule,
        MatIconModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
