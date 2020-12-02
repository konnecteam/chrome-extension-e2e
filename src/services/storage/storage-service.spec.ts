import { StorageService } from './storage-service';
import 'mocha';
import * as assert from 'assert';
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

  before('Mock chrome', () => {
    global.chrome = chrome;
  });

  it('Test de set data', () => {

    StorageService.setData({data : 'test de data'});
    assert.strictEqual(dataStorage, DATAVALUE);
  });

  it('Test de get data', () => {
    StorageService.get(['data'], () => {});
    assert.strictEqual(getStorage, DATAVALUE);
  });

  it('Test de remove data', () => {
    StorageService.remove('data');
    assert.strictEqual(dataStorage, '');
  });

});