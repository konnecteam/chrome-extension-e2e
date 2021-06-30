/**
 * Script qui permet de fake le time d'un scénario
 * Il va être buildé puis exporté dans le zip du scénario
 */

const FakeTimers = require('@sinonjs/fake-timers');

// On met à now à 0 mais on va le modifier lors de l'export du script.
FakeTimers.withGlobal(window).install({now : 0, shouldAdvanceTime: true });