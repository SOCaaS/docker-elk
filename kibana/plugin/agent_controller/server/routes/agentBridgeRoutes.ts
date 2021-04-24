import { IRouter, ILegacyScopedClusterClient } from '../../../../src/core/server';
import { SearchResponse } from 'elasticsearch';
import { schema } from '@kbn/config-schema';
import { v4 as uuidv4 } from 'uuid';

export function agentBridgeRoutes(router: IRouter) {

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

  router.post(
    {
      path: '/api/agent_controller/{id}',
      validate: {
        params: schema.object(
          {
            id: schema.string(),
          }
        ),
      }
    },
    async (context, request, response) => {
      return response.ok({
        body: {
          id: request.params.id
        }
      })
    }
  );

  // router.post(
  //   {
  //       path: '/api/agent_controller/posting_example',
  //       validate: {
  //         body: schema.object(
  //           {
  //             id: schema.string(),
  //             index: schema.string(),
  //             message: schema.string()
  //           }
  //         ),
  //       },
  //   },
  //   async (context, request, response) => {
  //       // const req = JSON.parse(request.body)
  //       const params = {
  //         index: request.body.index,
  //         id: request.body.id,
  //         body: {
  //           script : {
  //             source: "ctx._source.message = params.message",
  //             lang: "painless",
  //             params : {
  //               message : request.body.message
  //             }
  //           }
  //         }
  //       }
  //       await context.core.elasticsearch.legacy.client.callAsCurrentUser('update', params);
  //       return response.ok({ 
  //         body: {
  //           message: "okay",
  //           response: request.body
  //         }
  //        });
  //   }
  // );
}
