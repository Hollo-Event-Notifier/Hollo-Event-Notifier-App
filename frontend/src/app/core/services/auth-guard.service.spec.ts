// import {TestBed} from '@angular/core/testing';
// import {Router} from '@angular/router';
// import {of} from 'rxjs';
// import {AuthGuardService} from "./auth-guard.service";
// import {UsersApiService, UsersApiServiceInterface} from "../api";
//
// describe('AuthGuardService', () => {
//   let service: AuthGuardService;
//   let usersApiServiceSpy: jasmine.SpyObj<UsersApiServiceInterface>;
//   let routerSpy: jasmine.SpyObj<Router>;
//
//   beforeEach(() => {
//     usersApiServiceSpy = jasmine.createSpyObj<UsersApiService>(['checkToken']);
//     routerSpy = jasmine.createSpyObj<Router>(['navigate']);
//
//     TestBed.configureTestingModule({
//       providers: [
//         AuthGuardService,
//         {provide: UsersApiService, useValue: usersApiServiceSpy},
//         {provide: Router, useValue: routerSpy}
//       ]
//     });
//
//     service = TestBed.inject(AuthGuardService);
//   });
//
//   it('should return true if token check succeeds', (done: DoneFn) => {
//     // Arrange
//     usersApiServiceSpy.checkToken.and.returnValue(of(true));
//     let canActivate: boolean;
//
//     // Act
//     service.canActivate().subscribe(result => {
//       canActivate = result;
//
//       // Assert
//       expect(canActivate).toBeTrue();
//
//       done();
//     });
//   });
//
//   // TODO: test catcherror branch
// });
