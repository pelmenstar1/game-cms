import { defineEntityCheck, type EntityMeta } from '@game-cms/base-core';
import { type ApiRoute, apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

import { updateReviewersPayload } from './schema/review.js';

declare module '@game-cms/base-core' {
  interface EntityCheckTypeMap {
    'base::review': {
      clientData: {
        reviewers: Record<string, { approved: boolean }>;
      };
      storageData: {
        reviewers: Record<string, { lastApproveTime?: number } | undefined>;
      };
      actions: {
        approve: null;
      };
    };
  }

  interface DatabaseEntityMap {
    'base::entityCheck::review::config': {
      requiredReviewers: ObjectId[];
    };
  }
}

function configCollection() {
  return cms()
    .service('base::database')
    .collection('base::entityCheck::review::config');
}

async function getRequiredReviewers() {
  const result = await configCollection().findOne();

  return result?.requiredReviewers ?? [];
}

function isApproved(
  meta: EntityMeta | undefined,
  lastApproveTime: number | undefined
) {
  const lastUpdatedTime = meta?.lastUpdatedTime;

  return (
    lastUpdatedTime !== undefined &&
    lastApproveTime !== undefined &&
    lastUpdatedTime < lastUpdatedTime
  );
}

export function review() {
  return defineEntityCheck({
    id: 'base::review',
    routes: [
      apiRoute({
        url: '/entityCheck/base::review/reviewers',
        method: 'GET',
        config: {
          id: 'entityCheck/base::review/reviewers$get',
        },
        handler: () => {
          return [];
        },
      }),
      apiRoute({
        url: '/entityCheck/base::review/reviewers',
        method: 'PUT',
        config: {
          id: 'entityCheck/base::review/reviewers$update',
        },
        schema: {
          body: updateReviewersPayload,
        },
        handler: async (req) => {
          const { userIds } = req.body;

          await configCollection().updateOne(
            {},
            { $set: { requiredReviewers: userIds } }
          );
        },
      }) as ApiRoute,
    ],
    actions: {
      approve: {
        execute: ({ storageData, context }) => {
          const actorId = context.actorId.toString();
          const utcNow = Date.now();

          return {
            reviewers: {
              ...storageData?.reviewers,
              [actorId]: { approved: true, lastApproveTime: utcNow },
            },
          };
        },
      },
    },
    when: ({ id }) => id !== undefined,
    execute: async ({ entityMeta, storageData }) => {
      const requiredReviewers = await getRequiredReviewers();

      for (const requiredReviewer of requiredReviewers) {
        const reviewerId = requiredReviewer.toString();

        if (
          !isApproved(
            entityMeta,
            storageData?.reviewers[reviewerId]?.lastApproveTime
          )
        ) {
          throw new Error(`Entity is not approved by user ${reviewerId}`);
        }
      }
    },
    getClientData: async ({ entityMeta, storageData }) => {
      const requiredReviewers = await getRequiredReviewers();

      return {
        reviewers: Object.fromEntries(
          requiredReviewers.map((userId) => {
            const userIdString = userId.toString();

            return [
              userIdString,
              {
                approved: isApproved(
                  entityMeta,
                  storageData?.reviewers[userIdString]?.lastApproveTime
                ),
              },
            ] as const;
          })
        ),
      };
    },
  });
}
