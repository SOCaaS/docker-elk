import { IRouter, ILegacyScopedClusterClient } from '../../../../src/core/server';
import { SearchResponse } from 'elasticsearch';
import { schema } from '@kbn/config-schema';

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/agent_controller/example',
      validate: false,
    },
    async (context, request, response) => {
      return response.ok({
        body: {
          time: new Date().toISOString(),
        },
      });
    }
  );
  
  router.get(
    {
      path: '/api/agent_controller/sidenav_content',
      validate: false,
    },
    async (context, request, response) => {
      const params = {
        index: "agent-index",
        body: {
          query: {
            bool:{
              must_not:{
                match:{
                  "_id" : "default"
                }
              }
            }
          },
        },
      }
      const res: SearchResponse<unknown> = await context.core.elasticsearch.legacy.client.callAsCurrentUser('search', params);
      return response.ok({
        body: res.hits.hits,
      });
    }
  );
  
  router.post(
    {
        path: '/api/agent_controller/post_example',
        validate: {
          body: schema.string()
        },
    },
    async (context, request, response) => {
        const req = JSON.parse(request.body)
        const params = {
          index: req.index,
          id: req.id,
          body: {
            script : {
              source: "ctx._source.message = params.message",
              lang: "painless",
              params : {
                message : "123"
              }
            }
          }
        }
        await context.core.elasticsearch.legacy.client.callAsCurrentUser('update', params);
        return response.ok({ 
          body: {
            message: "okay",
            response: req
          }
         });
    }
  );

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
  )

  router.get(
    {
      path: '/api/agent_controller/default',
      validate: false,
    },
    async (context, request, response) => {
      const params = {
        index: "agent-index",
        body: {
          query: {
            match:{
              "_id" : "default"
            }
          },
        },
      }
      const res: SearchResponse<unknown> = await context.core.elasticsearch.legacy.client.callAsCurrentUser('search', params);
      return response.ok({
        body: res.hits.hits[0]._source,
      });
    }
  );
}
