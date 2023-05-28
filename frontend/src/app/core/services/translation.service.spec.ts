import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';
import { ApplicationStateService } from './application-state.service';
import { TranslocoService } from '@ngneat/transloco';
import { Language } from '../models/language';

describe('TranslationService', () => {
  let translationService: TranslationService;
  let applicationStateService: jasmine.SpyObj<ApplicationStateService>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(() => {
    const applicationStateSpy = jasmine.createSpyObj('ApplicationStateService', ['patchState']);
    const translocoSpy = jasmine.createSpyObj('TranslocoService', ['getActiveLang', 'setActiveLang']);

    TestBed.configureTestingModule({
      providers: [
        TranslationService,
        { provide: ApplicationStateService, useValue: applicationStateSpy },
        { provide: TranslocoService, useValue: translocoSpy }
      ]
    });

    translationService = TestBed.inject(TranslationService);
    applicationStateService = TestBed.inject(ApplicationStateService) as jasmine.SpyObj<ApplicationStateService>;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
  });

  it('should be created', () => {
    // Arrange

    // Act

    // Assert
    expect(translationService).toBeTruthy();
  });

  it('should return Language.Hu if the active language is Language.Hu', () => {
    // Arrange
    translocoService.getActiveLang.and.returnValue(Language.Hu);

    // Act
    const currentLanguage = translationService.currentLanguage;

    // Assert
    expect(currentLanguage).toBe(Language.Hu);
  });

  it('should return Language.En if the active language is not Language.Hu', () => {
    // Arrange
    translocoService.getActiveLang.and.returnValue('some other language');

    // Act
    const currentLanguage = translationService.currentLanguage;

    // Assert
    expect(currentLanguage).toBe(Language.En);
  });

  it('should set the active language to Language.En and update the state to Language.En if the active language is Language.Hu', () => {
    // Arrange
    translocoService.getActiveLang.and.returnValue(Language.Hu);

    // Act
    translationService.changeLanguage();

    // Assert
    expect(translocoService.setActiveLang).toHaveBeenCalledWith(Language.En);
    expect(applicationStateService.patchState).toHaveBeenCalledWith({ language: Language.En });
  });

  it('should set the active language to Language.Hu and update the state to Language.Hu if the active language is not Language.Hu', () => {
    // Arrange
    translocoService.getActiveLang.and.returnValue('some other language');

    // Act
    translationService.changeLanguage();

    // Assert
    expect(translocoService.setActiveLang).toHaveBeenCalledWith(Language.Hu);
    expect(applicationStateService.patchState).toHaveBeenCalledWith({ language: Language.Hu });
  });
});
