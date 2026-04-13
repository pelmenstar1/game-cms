import path from 'node:path';

import {
  defineEntityCheck,
  type EntityDocumentMeta,
  NoPasswordUser,
} from '@game-cms/base-core';
import { type ApiRoute, apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { ObjectId, WithId } from 'mongodb';

import { updateReviewersPayload } from './schema.js';
import { routes as dashboardRoutes } from './settings/routes.js';
import { GetReviewersResponse } from './types.js';

declare module '@game-cms/base-core' {
  interface DatabaseCollectionTypeMap {
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

async function getRequiredReviewersWithUserData() {
  const result = await configCollection()
    .aggregate<{ user: [WithId<Omit<NoPasswordUser, 'id'>>] }>([
      { $unwind: { path: '$requiredReviewers' } },
      {
        $lookup: {
          from: 'base::users',
          localField: 'requiredReviewers',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $project: { 'user.passwordHash': 0 } },
    ])
    .toArray();

  return result.map(({ user: [{ _id, ...rest }] }) => ({
    id: _id.toString(),
    ...rest,
  }));
}

function isApproved(
  meta: EntityDocumentMeta | undefined,
  lastApproveTime: number | undefined
) {
  const lastUpdatedTime = meta?.lastUpdatedTime;

  return (
    lastUpdatedTime !== undefined &&
    lastApproveTime !== undefined &&
    lastUpdatedTime < lastApproveTime
  );
}

export function review() {
  return defineEntityCheck({
    id: 'base::review',
    clientConfig: {
      filePath: path.join(import.meta.dirname, 'config.client.js'),
    },
    dashboard: {
      clientController: {
        filePath: path.join(import.meta.dirname, 'controller.client.js'),
      },
      routes: dashboardRoutes,
    },
    api: {
      routes: [
        apiRoute({
          url: '/entityCheck/base$review/reviewers',
          method: 'GET',
          config: {
            id: 'entityCheck/base::review/reviewers$get',
          },
          handler: async (): Promise<GetReviewersResponse> => {
            return { users: await getRequiredReviewersWithUserData() };
          },
        }),
        apiRoute({
          url: '/entityCheck/base$review/reviewers',
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
    },
    actions: {
      approve: {
        execute: ({ storageData, context }) => {
          const actorId = context.actorId.toString();
          const utcNow = Date.now();

          return {
            reviewers: {
              ...storageData?.reviewers,
              [actorId]: { lastApproveTime: utcNow },
            },
          };
        },
      },
    },
    when: ({ documentVariant }) => documentVariant === 'published',
    execute: async ({ documentMeta, storageData }) => {
      const requiredReviewers = await getRequiredReviewers();

      for (const requiredReviewer of requiredReviewers) {
        const reviewerId = requiredReviewer.toString();

        if (
          !isApproved(
            documentMeta,
            storageData?.reviewers[reviewerId]?.lastApproveTime
          )
        ) {
          throw new Error(`Entity is not approved by user ${reviewerId}`);
        }
      }
    },
    getClientData: async ({ documentMeta, storageData }) => {
      const requiredReviewers = await getRequiredReviewersWithUserData();

      return {
        reviewers: requiredReviewers.map((user) => {
          return {
            user,
            approved: isApproved(
              documentMeta,
              storageData?.reviewers[user.id]?.lastApproveTime
            ),
          };
        }),
      };
    },
  });
}
