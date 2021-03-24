import { StorageService } from './storage-service';
import 'jest';
import * as chrome from 'sinon-chrome';


const DATAVALUE = 'test de data';

let dataStorage : { [keys : string] : any; };

let getStorage : { [keys : string] : any; };
chrome.storage.local.set.withArgs({data : DATAVALUE }).callsFake(() => {
  dataStorage = { test : DATAVALUE};
});

chrome.storage.local.get.withArgs(['data']).callsFake(() => {
  getStorage = dataStorage;
});

chrome.storage.local.remove.withArgs('data').callsFake(() => {
  dataStorage = null;
});

describe('Test de Storage Service', () => {

  // Mock chrome
  beforeAll(() => {
    global.chrome = chrome;
  });

  test('Test de set data', () => {

    StorageService.setData({data : 'test de data'});
    expect(dataStorage.test).toEqual(DATAVALUE);
  });

  test('Test de get data', async () => {
    StorageService.getDataAsync(['data']);
    expect(getStorage.test).toEqual(DATAVALUE);

  });

  test('Test de remove data', () => {
    StorageService.removeDataAsync('data');
    expect(dataStorage).toBeNull();
  });

});