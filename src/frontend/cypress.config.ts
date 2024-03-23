// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from 'cypress';
import dotEnv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { resolve } from 'path';

const myEnv = dotEnv.config({
  path: resolve(__dirname, '../../.env'),
});
dotenvExpand.expand(myEnv);

const { FRONTEND_ADDR = '', NODE_ENV, FRONTEND_PORT = '46573' } = process.env;

//const baseUrl='http://lab.digitalq.ch:81/'
const baseUrl='http://localhost:37425/' 
export default defineConfig({
    projectId: '92ah2f',
  env: {
    baseUrl,
  },
  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: false,
  },
});
