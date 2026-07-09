import { createI18n } from 'vue-i18n';
import en from './locales/en';
import zh from './locales/zh';
import ja from './locales/ja';
import ko from './locales/ko';
import de from './locales/de';
import fr from './locales/fr';
import es from './locales/es';
import ru from './locales/ru';

const supportedLocales = ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'ru'];

function detectLocale(): string {
  const saved = localStorage.getItem('locale');
  if (saved && supportedLocales.includes(saved)) return saved;

  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    const code = lang.split('-')[0].toLowerCase();
    if (supportedLocales.includes(code)) return code;
  }
  return 'en';
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, zh, ja, ko, de, fr, es, ru },
});

export default i18n;
