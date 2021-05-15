import { IRouter, ILegacyScopedClusterClient } from '../../../../src/core/server';
import { SearchResponse } from 'elasticsearch';
import { schema } from '@kbn/config-schema';

export function agentPostRoutes(router: IRouter) {
  /*
    this is for activating the rule either tshark or suricata will be set through this api.
  */

  router.post(
    {
        path: '/api/agent_controller/{id}/activeService',
        validate: {
            params: schema.object(
                {
                    id: schema.string(),
                }
            ),
            body: schema.object(
                {
                    status: schema.boolean(),
                    service: schema.string()
                }
            ),
        },
    },
    async (context, request, response) => {

        const params = {
          index: "agent-index",
          id: request.params.id,
          body: {
            script : {
              source: "ctx._source.services."+request.body.service+".active = params.active",
              lang: "painless",
              params : {
                active : request.body.status
              }
            }
          }
        }
        await context.core.elasticsearch.legacy.client.callAsCurrentUser('update', params);
        return response.ok({ 
          body: {
            message: "okay",
            response: request.body
          }
         });
    }
  );

  /*
    This ../../edit api is used for editing rules in agent controller.
    Either suricata or tshark rules, it dynamically can adjust to it. (on Rule body)
  */

  router.post(
    {
        path: '/api/agent_controller/{id}/edit',
        validate: {
            params: schema.object(
                {
                    id: schema.string(),
                }
            ),
            body: schema.object(
                {
                    id: schema.number(),
                    rule: schema.string(),
                    service: schema.string()
                }
            ),
        },
    },
    async (context, request, response) => {

        const params = {
          index: "agent-index",
          id: request.params.id,
          body: {
            script : {
              source: "ctx._source.services."+request.body.service+".rules["+(request.body.id-1).toString()+"].details = params.message",
              lang: "painless",
              params : {
                message : request.body.rule
              }
            }
          }
        }
        await context.core.elasticsearch.legacy.client.callAsCurrentUser('update', params);
        return response.ok({ 
          body: {
            message: "okay",
            response: request.body
          }
         });
    }
  );

  /* 
    Like the edit, this add rules.
  */


  router.post(
    {
        path: '/api/agent_controller/{id}/add',
        validate: {
            params: schema.object(
                {
                    id: schema.string(),
                }
            ),
            body: schema.object(
                {
                    rule: schema.string(),
                    service: schema.string()
                }
            ),
        },
    },
    async (context, request, response) => {

        const params = {
          index: 'agent-index',
          id: request.params.id,
          body: {
            script : {
              source: "ctx._source.services."+request.body.service+".rules.addAll(params.rules)",
              lang: "painless",
              params : {
                rules : [
                  {
                    details : request.body.rule,
                    active : false
                  }
                ]
              }
            }
          }
        }
        await context.core.elasticsearch.legacy.client.callAsCurrentUser('update', params);
        return response.ok({ 
          body: {
            message: "okay",
            response: request.body
          }
         });
    }
  );

  /*
    this is for activating the rules inside either tshark or suricata will be set through this api.
  */

  router.post(
    {
        path: '/api/agent_controller/{id}/activeRule',
        validate: {
            params: schema.object(
                {
                    id: schema.string(),
                }
            ),
            body: schema.object(
                {
                    id: schema.number(),
                    service: schema.string(),
                    status: schema.boolean()
                }
            ),
        },
    },
    async (context, request, response) => {

        const params = {
          index: "agent-index",
          id: request.params.id,
          body: {
            script : {
              source: "ctx._source.services."+request.body.service+".rules["+(request.body.id-1).toString()+"].active = params.message",
              lang: "painless",
              params : {
                message : request.body.status
              }
            }
          }
        }
        await context.core.elasticsearch.legacy.client.callAsCurrentUser('update', params);
        return response.ok({ 
          body: {
            message: "okay",
            response: request.body
          }
         });
    }
  );

  /*
    Api for activating the agent service filebeat to start.
  */

  router.post(
    {
        path: '/api/agent_controller/{id}/status',
        validate: {
            params: schema.object(
                {
                    id: schema.string(),
                }
            ),
            body: schema.object(
                {
                    status: schema.boolean()
                }
            ),
        },
    },
    async (context, request, response) => {

        const params = {
          index: 'agent-index',
          id: request.params.id,
          body: {
            script : {
              source: "ctx._source.active = params.active",
              lang: "painless",
              params : {
                active : request.body.status
              }
            }
          }
        }
        await context.core.elasticsearch.legacy.client.callAsCurrentUser('update', params);
        return response.ok({ 
          body: {
            message: "okay",
            response: request.body
          }
         });
    }
  );

  /*
    this api get the interface pick on agent controller.
    ex. eth0 or eth1 interfaces which on agent service
  */

  router.post(
    {
        path: '/api/agent_controller/{id}/interface',
        validate: {
            params: schema.object(
                {
                    id: schema.string(),
                }
            ),
            body: schema.object(
                {
                    interface: schema.string(),
                }
            ),
        },
    },
    async (context, request, response) => {

        const params = {
          index: "agent-index",
          id: request.params.id,
          body: {
            script : {
              source: "ctx._source.interface = params.interface",
              lang: "painless",
              params : {
                interface : request.body.interface
              }
            }
          }
        }
        await context.core.elasticsearch.legacy.client.callAsCurrentUser('update', params);
        return response.ok({ 
          body: {
            message: "okay",
            response: request.body
          }
         });
    }
  );

  /* 
    Help delete a service if the service stuck on agent controller
    while it has been deleted on the server end.
  */

  router.post(
    {
        path: '/api/agent_controller/{id}/delete',
        validate: {
            params: schema.object(
                {
                    id: schema.string(),
                }
            )
        },
    },
    async (context, request, response) => {

        const params = {
          index: "agent-index",
          id: request.params.id
        }
        await context.core.elasticsearch.legacy.client.callAsCurrentUser('delete', params);
        return response.ok({ 
          body: {
            message: "okay",
            response: params
          }
         });
    }
  );

  /* 
    delete tshark or suricata rule from the list of data.
  */

  router.post(
    {
        path: '/api/agent_controller/{id}/deleteRule',
        validate: {
            params: schema.object(
                {
                    id: schema.string(),
                }
            ),
            body: schema.object(
              {
                id: schema.number(),
                service: schema.string()
              }
            )
        },
    },
    async (context, request, response) => {

        const params = {
          index: "agent-index",
          id: request.params.id,
          body: {
            script : {
              source: "ctx._source.services."+request.body.service+".rules.remove(params.id)",
              lang: "painless",
              params : {
                id : (request.body.id - 1)
              }
            }
          }
        }
        await context.core.elasticsearch.legacy.client.callAsCurrentUser('update', params);
        return response.ok({ 
          body: {
            message: "okay",
            response: request.body
          }
         });
    }
  );
}
