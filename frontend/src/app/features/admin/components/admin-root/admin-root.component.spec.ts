import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {of} from 'rxjs';
import {AdminRootComponent} from './admin-root.component';
import {ApplicationStateService} from '../../../../core/services/application-state.service';
import {TranslationService} from '../../../../core/services/translation.service';
import {UsersService} from '../../../../core/services/users.service';
import {UserEditorDialogComponent} from '../user-editor-dialog/user-editor-dialog.component';
import {UserEditorData} from '../../models/user-editor-data';
import {User} from '../../../../core/models/user';
import {UserDtoRoleEnum} from "../../../../core/api";
import {RouterTestingModule} from "@angular/router/testing";
import {getTranslocoModule} from "../../../../core/utils/transloco-testing.factory";

describe('AdminRootComponent', () => {
  let component: AdminRootComponent;
  let fixture: ComponentFixture<AdminRootComponent>;
  let applicationStateService: jasmine.SpyObj<ApplicationStateService>;
  let translationService: jasmine.SpyObj<TranslationService>;
  let matDialog: jasmine.SpyObj<MatDialog>;
  let usersService: jasmine.SpyObj<UsersService>;

  const currentUserStub: User = {
    userType: 'current',
    username: 'test username',
    email: 'test email',
    role: UserDtoRoleEnum.EventAdmin
  }

  beforeEach(async () => {
    applicationStateService = jasmine.createSpyObj('ApplicationStateService', [],
      {currentUser$: of(currentUserStub)});
    translationService = jasmine.createSpyObj('TranslationService', ['changeLanguage']);
    matDialog = jasmine.createSpyObj('MatDialog', ['open']);
    usersService = jasmine.createSpyObj('UsersService', ['updateUser']);

    await TestBed.configureTestingModule({
      declarations: [AdminRootComponent],
      providers: [
        {provide: ApplicationStateService, useValue: applicationStateService},
        {provide: TranslationService, useValue: translationService},
        {provide: MatDialog, useValue: matDialog},
        {provide: UsersService, useValue: usersService}
      ],
      imports: [
        RouterTestingModule,
        getTranslocoModule()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRootComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentUser$ and currentLanguage', () => {
    // Arrange

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.currentUser$).toBe(applicationStateService.currentUser$);
    expect(component.currentLanguage).toBe(translationService.currentLanguage);
    expect(component.currentUser).toBe(currentUserStub);
  });

  it('should unsubscribe from observables on ngOnDestroy', () => {
    // Arrange
    spyOn(component['unsubscribe$'], 'next');
    spyOn(component['unsubscribe$'], 'complete');

    // Act
    component.ngOnDestroy();

    // Assert
    expect(component['unsubscribe$'].next).toHaveBeenCalled();
    expect(component['unsubscribe$'].complete).toHaveBeenCalled();
  });

  it('should change the language', () => {
    // Act
    component.changeLanguage();

    // Assert
    expect(translationService.changeLanguage).toHaveBeenCalled();
    expect(component.currentLanguage).toBe(translationService.currentLanguage);
  });

  it('should open the editor dialog and update the user', () => {
    // Arrange
    const mockUser: User = { /* Mock user object data */} as User;

    const matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<UserEditorDialogComponent>>(['afterClosed']);

    matDialog.open.and.returnValue(matDialogRefSpy);
    matDialogRefSpy.afterClosed.and.returnValue(of(mockUser));


    // Act
    component.openEditorDialog();

    // Assert
    expect(matDialog.open).toHaveBeenCalledWith(UserEditorDialogComponent, {
      data: {user: component.currentUser, mode: 'current'} as UserEditorData
    });
    expect(usersService.updateUser).toHaveBeenCalledWith(mockUser);
  });
});
