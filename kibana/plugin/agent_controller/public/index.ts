import './index.scss';

import { AgentControllerPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new AgentControllerPlugin();
}
export { AgentControllerPluginSetup, AgentControllerPluginStart } from './types';
