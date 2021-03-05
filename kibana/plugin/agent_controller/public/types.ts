import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface AgentControllerPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgentControllerPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
