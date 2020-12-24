import { FileService } from './file-service';
import 'jest';
import * as fs from 'fs';
import * as path from 'path';

let fileService : FileService;

describe('Test de File Service', () => {

  // On initialise Fsileservice
  beforeAll(() => {
    fileService = FileService.Instance;
  });

  test('Test de addfile', () => {

    fileService.addfile('file.txt', `data:plain/text;base64,ZmRmZGZkZmRkZg==`);
    expect(fileService.getFilesList().length).toBeGreaterThan(0);
  });

  test('Test de buildFile', () => {

    expect(
      fileService.buildFile('file.txt', `data:plain/text;base64,ZmRmZGZkZmRkZg==`).name
    ).toStrictEqual('file.txt');
  });

  test('Test de clearList', () => {

    fileService.clearList();
    expect(
      fileService.getFilesList().length
    ).toStrictEqual(0);
  });

  test('Test de sendFilesToBackground', () => {

    // FileList n'est pas utilisable comme une objet normal
    // const blob = new Blob([''], { type: 'text/html' });
    // blob['lastModifiedDate'] = new Date();
    // blob['name'] = 'text.txt';
    // const file = blob as File;
    // const fileList = {
    //   0: file,
    //   1: file,
    //   length: 2,
    //   item: (index : number) => file
    // };
    // const fileTosend = new File(['content'], 'text.txt');
    // const fileList = [];
    // fileList.push(fileTosend);
    // expect(
    //   fileService.sendFilesToBackground(fileList)).toStrictEqual('text.txt');
  });


  test('Test de readFileAsync', async () => {
    const fileTestFile = path.join(__dirname, './../../../static/test/file/test.txt');

    const contentFileExpect = fs.readFileSync(fileTestFile, 'utf-8');

    const result = await FileService.readFileAsync(fileTestFile);

    expect(result).toEqual(contentFileExpect);

  });

});