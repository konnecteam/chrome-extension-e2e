/**
 * Factory qui permet de créér un fichier
 */
export class FileFactory {

  /**
   * Construit un objet contenant le mime et le uin8array necessaire à un fichier
   */
  public static buildFileObject(content : string) : { type : string, u8arr : Uint8Array }  {

    const arr = content.split(',');
    const type = arr[0] ? arr[0].match(/:(.*?);/)[1] : null ;
    const bstr = atob(arr[1]);
    let length = bstr.length;
    const u8arr = new Uint8Array(length);

    while (length-- >= 0) {
      u8arr[length] = bstr.charCodeAt(length);
    }

    return {
      type,
      u8arr
    };
  }
}