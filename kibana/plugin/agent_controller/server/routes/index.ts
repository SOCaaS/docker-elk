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
      path: '/api/agent_controller/test',
      validate: false,
    },
    async (context, request, response) => {
      const params = {
        index: "test-index",
        body: {
          query: {
            match_all : {},
          },
        },
      }
      const res: SearchResponse<unknown> = await context.core.elasticsearch.legacy.client.callAsCurrentUser('search', params);
      return response.ok({
        body: {
          result: res.hits,
        },
      });
    }
  );
}