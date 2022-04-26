import { ChromeService } from '../../services/chrome/chrome-service';

// Constant
import HEADER from '../../constants/code-generate/header-code';
import FOOTER from '../../constants/code-generate/footer-code';

/** Service de gestion du scenario */
export class ScenarioService {

  /** Path du script fake time buildé et qui se situe dans dist */
  public static readonly FAKE_TIME_SCRIPT_PATH : string = './lib/scripts/fake-time/fake-time.js';

  /** Chemin du dossier contenant les dépendances du scénario */
  public static readonly SCENARIO_DEPENDENCIES_PATH : string = 'services/scenario/';

  /** Nom des fichiers dépendant au scénario */
  public static readonly SCENARIO_SERVICE_DEPENDENCIES : string[] = [
    `request-service.js`,
    `page-service.js`,
    `token-service.js`,
    `url-service.js`,
    `browser-service.js`,
  ];

  /** Récupération des imports nécessaire au scénario */
  public static getImport(includeHttpRequest : boolean) : string {
    return includeHttpRequest ? HEADER.IMPORT_HTTP_REQUEST : HEADER.IMPORT_PUPPETEER;
  }

  /** Récupéraiton du header  */
  public static getHeader(includeWrapAsync : boolean) {
    return includeWrapAsync ? HEADER.WRAPPED_HEADER : HEADER.HEADER;
  }

  /** Récupération du footer */
  public static getFooter(includeWrapAsync : boolean) : string {
    return includeWrapAsync ? FOOTER.WRAPPED_FOOTER : FOOTER.FOOTER;
  }

  /** Récupération du contenu du fake time script */
  public static async getFakeTimeScriptContentAsync() : Promise<string> {

    return new Promise((resolve, reject) => {

      /** Pour lire un fichier dans un plugin chrome il faut qu'il soit accessible et il faut fetch l'url pour récupérer le résultat */
      fetch(ChromeService.getUrl(ScenarioService.FAKE_TIME_SCRIPT_PATH))
        .then(response => response.text())
        .then(value => {
          resolve(value);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Permet de récupérer le contenu du fake time script buildé et des services utilisés par le scénario
   */
  public static getScenarioFilesContent() : string[] {

    // List des fichiers dépendant au scénario
    const scenarioDependencies : string[] = [];

    /** Récupération des services utiles */
    for (let i = 0; i < ScenarioService.SCENARIO_SERVICE_DEPENDENCIES.length; i++) {

      const filename = ScenarioService.SCENARIO_SERVICE_DEPENDENCIES[i];

      fetch(ChromeService.getUrl(`${ScenarioService.SCENARIO_DEPENDENCIES_PATH}${filename}`))
        .then(response => response.text())
        .then(value => {
          scenarioDependencies[i] = value;
        });
    }

    return scenarioDependencies;
  }
}