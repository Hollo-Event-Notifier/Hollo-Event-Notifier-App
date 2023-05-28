import { TranslocoTestingModule, TranslocoTestingOptions } from '@ngneat/transloco';
import en from '../../../assets/i18n/en.json';
import hu from '../../../assets/i18n/hu.json';

export function getTranslocoModule(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    langs: { en, hu },
    translocoConfig: {
      availableLangs: ['en', 'hu'],
      defaultLang: 'hu',
    },
    preloadLangs: true,
    ...options
  });
}
