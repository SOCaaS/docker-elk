import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { SearchResponse } from 'elasticsearch';

import * as fs from 'fs';

import { AgentControllerPluginSetup, AgentControllerPluginStart } from './types';
import { defineRoutes } from './routes';
import { agentBridgeRoutes } from './routes/agentBridgeRoutes'
import { agentPostRoutes } from './routes/agentPostRoutes'

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
    agentBridgeRoutes(router);
    agentPostRoutes(router);

    return {};
  }


  public start(core: CoreStart) {

    async function templateTask() {
      const params = JSON.parse(fs.readFileSync("./plugins/agentController/server/templates/agent-index.json"));
      const result = await core.elasticsearch.client.asInternalUser.indices.putTemplate(params);
    }

    async function defaultDoc() {
      const params = JSON.parse(fs.readFileSync("./plugins/agentController/server/templates/agent-default.json"));
      const result = await core.elasticsearch.client.asInternalUser.create(params);
    }

    /*

      create default index and default template of agent controller

    */

    console.log("Add Plugin Template Installation!");
    templateTask();
    console.log("Add Plugin Default Document Installation!");
    defaultDoc();
    
    return {};
  }

  public stop() {}
}
