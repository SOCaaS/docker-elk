import { IRouter, ILegacyScopedClusterClient } from '../../../../src/core/server';
import { SearchResponse } from 'elasticsearch';
import { schema } from '@kbn/config-schema';

export function defineRoutes(router: IRouter) {
  
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
            bool: {
              must_not : [
                {
                  match : {
                    _id : "default
                  },
                },
              ]
            },
          },
          fields: ["name"],
          _source: false
        },
      }
      const res: SearchResponse<unknown> = await context.core.elasticsearch.legacy.client.callAsCurrentUser('search', params);
      return response.ok({
        body: res.hits.hits,
      });
    }
  );

  router.get(
    {
      path: '/api/agent_controller/{id}',
      validate: {
        params: schema.object(
          {
            id: schema.string(),
          }
        ),
      },
    },
    async (context, request, response) => {
      const params = {
        index: "agent-index",
        body: {
          query: {
            match:{
              "_id" : request.params.id
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
