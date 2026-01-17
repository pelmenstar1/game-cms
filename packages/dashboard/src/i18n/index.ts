import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { language, resources } from 'virtual:dashboard/i18nData';

void i18n.use(initReactI18next).init({
  lng: language,
  resources,
});
