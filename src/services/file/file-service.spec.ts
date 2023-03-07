import { FileService } from './file-service';
import 'jest';
import * as fs from 'fs';
import * as path from 'path';

let fileService : FileService;

describe('Test de File Service', () => {

  // On initialise Fileservice
  beforeAll(() => {
    fileService = FileService.Instance;
  });

  test('Test de addfile', () => {

    fileService.addfile('file.txt', `data:plain/text;base64,ZmRmZGZkZmRkZg==`);
    expect(fileService.getUploadedFiles().length).toBeGreaterThan(0);
  });

  test('Test de buildFile', () => {

    expect(
      fileService.buildFile('file.txt', `data:plain/text;base64,ZmRmZGZkZmRkZg==`).name
    ).toStrictEqual('file.txt');
  });

  test('Test de clearList', () => {

    fileService.clearUploadedFiles();
    expect(
      fileService.getUploadedFiles().length
    ).toStrictEqual(0);
  });

  test('Test de readFileAsync', async () => {
    const fileTestFile = path.join(__dirname, './../../test/file/test.txt');

    const contentFileExpect = fs.readFileSync(fileTestFile, 'utf-8');

    const result = await FileService.readFileAsync(fileTestFile);

    expect(result).toEqual(contentFileExpect);

  });

});