import JSZip = require('jszip');

/**
 * Service qui permet la gestion des fichiers zip
 */
export class ZipService {

  /** Instance de classe */
  public static instance : ZipService;

  /** JSZip permet de manipuler des fichiers zip  */
  private _zip : JSZip;

  constructor() {
    this._zip = new JSZip();
  }

  /**
   * Récupération de l'instance de la classe
   */
  public static get Instance() : ZipService {
    if (ZipService.instance == null) {
      ZipService.instance = new ZipService();
    }
    return ZipService.instance;
  }

  /**
   * Ajout d'un fichier dans un dossier du zip
   */
  public addFileInFolder(path : string, content : File) : JSZip {
    return this._zip.file(path, content);
  }

  /**
   * Generation du fichier zip
   */
  public async generateAsync() : Promise<any> {
    return this._zip.generateAsync({
      type : 'nodebuffer'
    });
  }

  public resetZip() : void {
    this._zip = new JSZip();
  }
}