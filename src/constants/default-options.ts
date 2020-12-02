import { OptionModel } from 'models/options-model';
/**
 * Constantes des valeurs des options par défauts
 */
export const defaults : OptionModel = {
  wrapAsync: true,
  headless: false,
  waitForNavigation: true,
  waitForSelectorOnClick: true,
  blankLinesBetweenBlocks: true,
  dataAttribute: '',
  useRegexForDataAttribute: false,
  customLineAfterClick: '',
  recordHttpRequest: true,
  regexHTTPrequest: '',
  customLineBeforeEvent : 'await page.waitFor(1000);'
};