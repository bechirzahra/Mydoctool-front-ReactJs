"use strict";

import translationsFR from "../translations/main.fr";
import translationsEN from "../translations/main.eng";

class Translator {

  constructor() {

  }

  static translate(key) {
    if(this.locale == 'FR') {
      if (translationsFR[key]) {
        return translationsFR[key];
      }
    }
    if(this.locale == 'EN') {
      if (translationsEN[key]) {
        return translationsEN[key];
      }
    }
      return key;
  }

  static changeLaguage(lang) {
    this.locale = lang;
    localStorage.setItem('langue', lang);
  }

}

export default Translator;
