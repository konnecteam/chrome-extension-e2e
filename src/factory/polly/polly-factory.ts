import { PollyService } from '../../services/polly/polly-service';

/**
 * Factory de polly
 */
export class PollyFactory {

  /**
   * Permet de construire un objet contenant les résultat lié à polly
   */
  public static buildResultObject() : { folderName : string, har : string } {

    // Definition pollyservice
    const pollyService : PollyService = PollyService.Instance;

    return {
      folderName : pollyService.getRecordId() !== '' ? pollyService.getRecordId() : 'emptyResult',
      har : pollyService.getRecordHar() !== '' ? pollyService.getRecordHar() : 'No request recorded'
    };
  }
}