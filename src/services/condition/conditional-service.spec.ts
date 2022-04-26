import { ConditionalService } from './conditional-service';
import 'jest';

describe('Test du AwaitConditionalService', () => {

  test('Test de la fonction waitForConditionAsync', async () => {
    (window as any).isOk = false;
    window.setTimeout(() => (window as any).isOk = true, 200);
    await ConditionalService.waitForConditionAsync(() => (window as any).isOk);

    expect((window as any).isOk).toBeTruthy();
  });

});