import { FileFactory } from '../../factory/file/file-facory';
import { ChromeService } from './../chrome/chrome-service';
import * as fs from 'fs';

/**
 * Service Global qui permet la gestion des enregistrements depuis le background
 */
export class FileService {

  /** Instant de class */
  public static instance : FileService;

  /** Liste des fichiers uplaodés */
  private _uploadedFiles : File[];

  /** Nom du fichier */
  private _filename : string;

  /** Control du message */
  private _control : string;

  /** Lis le contenu du fichier */
  private _reader : FileReader;

  constructor() {
    this._uploadedFiles = [];
    this._filename = '';
    this._control = '';
    this._reader = new FileReader();

    // Après avoir lu le fichier on l'envoi au background
    this._reader.addEventListener('load', () => {
      ChromeService.sendMessage({
        control: this._control,
        filename: this._filename,
        content: this._reader.result
      });
    }, false);

  }

  /**
   * Récupération de l'instance de la classe
   */
  public static get Instance() : FileService {
    if (FileService.instance == null) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  /**
   * Ajoute un fichier dans la liste de fichier uploadé
   *
   * @param name nom du fichier
   * @param content contenu du fichier en base 64
   */
  public addfile(name : string, content : string) : void {
    this._uploadedFiles.push(this.buildFile(name, content));
  }

  /**
   * Construit un fichier à partir d'un content en base64
   *
   * @param name nom du fichier
   * @param content contenu du fichier en base 64
   */
  public buildFile(name : string, content : string) : File {
    const filObject = FileFactory.buildFileObject(content);
    return new File([filObject.u8arr], name, { type : filObject.type });
  }

  /**
   * Permet de nettoyer la liste des fichier uploadé
   */
  public clearList() : void {
    this._uploadedFiles = [];
  }

  /**
   * Récupère la liste des fichiers uploadés
   */
  public getFilesList() : File[] {
    return this._uploadedFiles;
  }

  /**
   * Envoi un fichier au background
   */
  private _getFileTOSend(file : File) : string  {

    if (file) {

      this._filename = file.name;
      this._control = 'get-newFile';
      this._reader.readAsDataURL(file);
    }
    return this._filename;
  }

  /**
   * Envoi au background la liste des fichiers à uploader
   */
  public sendFilesToBackground(files : FileList) : string {

    const listFiles : string[] = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {

        listFiles.push(this._getFileTOSend(files[i]));
      }
    }

    return listFiles.join(';');
  }

  /**
   * Permet de lire un fichier
   */
  public static async readFileAsync(filePath : string) : Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  }
}