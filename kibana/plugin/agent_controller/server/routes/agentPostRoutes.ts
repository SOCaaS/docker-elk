import { IRouter, ILegacyScopedClusterClient } from '../../../../src/core/server';
import { SearchResponse } from 'elasticsearch';
import { schema } from '@kbn/config-schema';

export function agentPostRoutes(router: IRouter) {
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
                    id: schema.string(),
                    rule: schema.string(),
                    service: schema.string()
                }
            ),
        },
    },
    async (context, request, response) => {
        // const req = JSON.parse(request.body)
        const params = {
          index: request.body.index,
          id: request.body.id,
          body: {
            script : {
              source: "ctx._source.message = params.message",
              lang: "painless",
              params : {
                message : request.body.message
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
