import { IRouter, ILegacyScopedClusterClient } from '../../../../src/core/server';
import { SearchResponse } from 'elasticsearch';

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