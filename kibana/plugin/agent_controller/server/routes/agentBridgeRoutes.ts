//@ezeutno Ivan Ezechial Suratno

import { IRouter, ILegacyScopedClusterClient } from '../../../../src/core/server';
import { SearchResponse } from 'elasticsearch';
import { schema } from '@kbn/config-schema';
import { v4 as uuidv4 } from 'uuid';

export function agentBridgeRoutes(router: IRouter) {

  /* 
    This api will create a agent service index on elasticsearch.
    It would accept a post messsage ../../create path.

    the api would create an elsticsearch index based on default data that 
    have been put in elasticsearch, which default to ./templates/agent-defaults.json
    
    This api used on agent service initialization.
  */

  router.post(
    {
      path: '/api/agent_controller/create',
      validate: {
        body: schema.object(
          {
              interfaces: schema.arrayOf(schema.string()),
              ip: schema.string(),
              name: schema.string()
          }
        ),
      }
    },
    async (context, request, response) => {
      const params = {
        index: "agent-index",
        body: {
          query: {
            match : {
              _id : "default"
            }
          }
        },
      }
      const res: SearchResponse<unknown> = await context.core.elasticsearch.legacy.client.callAsCurrentUser('search', params);
      const value = res.hits.hits[0]._source;

      value["interfaces"] = request.body.interfaces
      value["ip"] = request.body.ip
      value["name"] = request.body.name

      const cParams = {
        index: "agent-index",
        id: uuidv4(),
        method: "post",
        body: value
      }

      const result = await context.core.elasticsearch.legacy.client.callAsCurrentUser('create', cParams);

      return response.ok({
        body: {
          _id: result._id
        }
      })
    }
  )

  /*
    This api recived a usage stats from the client to update on elasticsearch.
    The usage state consist of CPU and Memory of the Client in Agent Service
  */

  router.post(
    {
      path: '/api/agent_controller/{id}/usage',
      validate: {
        params: schema.object(
          {
            id: schema.string(),
          }
        ),
        body: schema.object(
          {
              cpu: schema.number(),
              memory: schema.number()
          }
        ),
      }
    },
    async (context, request, response) => { 

      const params = {
        index: "agent-index",
        id: request.params.id,
        body: {
          script : {
            source: "ctx._source.cpu = params.cpu",
            lang: "painless",
            params : {
              cpu : request.body.cpu
            }
          }
        }
      }
      await context.core.elasticsearch.legacy.client.callAsCurrentUser('update', params);

      const mParams = {
        index: "agent-index",
        id: request.params.id,
        body: {
          script : {
            source: "ctx._source.memory = params.memory",
            lang: "painless",
            params : {
              memory : request.body.memory
            }
          }
        }
      }
      await context.core.elasticsearch.legacy.client.callAsCurrentUser('update', mParams);

      return response.ok({ 
        body: {
          message: "okay",
          response: request.body
        }
       });
    }
  );

  /*
    This api setup the frequencies of checking on agent controller.
    So, how long does the agent service check to kibana. 

    This would be determine using this post method.
  */

  router.post(
    {
        path: '/api/agent_controller/{id}/time',
        validate: {
            params: schema.object(
                {
                    id: schema.string(),
                }
            ),
            body: schema.object(
                {
                    time: schema.string(),
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
              source: "ctx._source.time = params.time",
              lang: "painless",
              params : {
                time : request.body.time
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
