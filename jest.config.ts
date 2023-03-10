import type {Config} from '@jest/types';
import * as chrome from 'sinon-chrome';

const config : Config.InitialOptions = {
  'globals' : {
    'chrome': chrome
  },
  'setupFiles': ['<rootDir>/jest.env.js'],
  'testEnvironment': 'jsdom',
  'moduleNameMapper': {
    '^vue$': 'vue/dist/vue.common.js'
  },
  'testRegex' : '\\.spec.ts',
  'moduleFileExtensions': [
    'js',
    'vue',
    'json',
    'ts',
  ],
  'transform': {
    '.(\\.ts|\\.tsx)': 'ts-jest',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/jest-vue-preprocessor'
  }
};

export default config;