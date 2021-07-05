/**
 * Enum des actions de controle entre App et le recording-controller
 */
export enum EControlAction {
  START = 'start',
  STOP = 'stop',
  CLEANUP = 'cleanup',
  PAUSE = 'pause',
  UNPAUSE = 'unpause',
  EXPORT_SCRIPT = 'exportScript'
}