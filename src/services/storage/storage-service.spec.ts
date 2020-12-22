import { StorageService } from './storage-service';
import 'jest';
import * as chrome from 'sinon-chrome';


const DATAVALUE = 'test de data';

let dataStorage = '';

let getStorage = '';
chrome.storage.local.set.withArgs({data : DATAVALUE }).callsFake(() => {
  dataStorage = DATAVALUE;
});

chrome.storage.local.get.withArgs(['data']).callsFake(() => {
  getStorage = dataStorage;
});

chrome.storage.local.remove.withArgs('data').callsFake(() => {
  dataStorage = '';
});

describe('Test de Storage Service', () => {

  // Mock chrome
  beforeAll(() => {
    global.chrome = chrome;
  });

  test('Test de set data', () => {

    StorageService.setData({data : 'test de data'});
    expect(dataStorage).toEqual(DATAVALUE);
  });

  test('Test de get data', () => {
    StorageService.get(['data'], () => {});
    expect(getStorage).toEqual(DATAVALUE);

  });

  test('Test de remove data', () => {
    StorageService.remove('data');
    expect(dataStorage).toEqual('');
  });

});