import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import * as fs from 'fs';
import * as process from 'process';

import { AgentControllerPluginSetup, AgentControllerPluginStart } from './types';
import { defineRoutes } from './routes';

export class AgentControllerPlugin
  implements Plugin<AgentControllerPluginSetup, AgentControllerPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('agentController: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('agentController: Started');
    console.log("Execute Plugin Installation!");
    const params = JSON.parse(fs.readFileSync("./plugins/agentController/server/agent-index.json"));
    console.log(core.elasticsearch.legacy.client.callAsCurrentUser('indices.put_template', params));
    return {};
  }

  public stop() {}
}
