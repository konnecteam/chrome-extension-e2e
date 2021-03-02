import { IOptionModel } from 'models/i-options-model';
/**
 * Constantes des valeurs des options par défauts
 */
export const defaults : IOptionModel = {
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
  customLinesBeforeEvent : `await page.evaluate(async() => {
    await konnect.engineStateService.Instance.waitForAsync(1);
  });`
};