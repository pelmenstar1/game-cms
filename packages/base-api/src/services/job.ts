import {
  JobDataById,
  JobDescriptor,
  JobDescriptorMap,
  JobId,
  JobInstance,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms, log } from '@game-cms/global';
import { asyncRetryOnError } from '@game-cms/shared';
import { WithId } from 'mongodb';

type PostedJob<Id extends JobId = JobId> = WithId<
  Omit<JobInstance<Id>, 'status'>
>;

declare module '@game-cms/base-core' {
  interface DatabaseCollectionTypeMap {
    'base::job': JobInstance;
  }

  interface AppEventsRegistry {
    'base::job::posted': {
      job: PostedJob;
    };
  }
}

const descriptorRegistry: Partial<JobDescriptorMap> = {};

function collection() {
  return cms().service('base::database').collection('base::job');
}

function getDescriptor<Id extends JobId>(id: Id): JobDescriptor<Id> {
  const descriptor = descriptorRegistry[id];

  if (!descriptor) {
    throw new Error(`No job descriptor registered for id "${id}"`);
  }

  return descriptor as unknown as JobDescriptor<Id>;
}

async function executeJobFromDescriptor<Id extends JobId>(
  descriptor: JobDescriptor<Id>,
  data: JobDataById<Id>
) {
  function baseExecute() {
    return descriptor.execute(data);
  }

  const { retry } = descriptor;

  await (retry ? asyncRetryOnError(baseExecute, retry) : baseExecute());
}

async function executeJob<Id extends JobId>(instance: PostedJob<Id>) {
  const type = instance.type;
  const jobInstanceId = instance._id;

  const jobLogger = log().child({ jobType: type, jobId: jobInstanceId });

  const col = collection();
  const idFilter = { _id: jobInstanceId };

  try {
    await col.updateOne(idFilter, { $set: { status: 'in-progress' } });

    const descriptor = getDescriptor(type);

    jobLogger.info('Starting job execution');

    await executeJobFromDescriptor(descriptor, instance.data);
    await col.deleteOne(idFilter);

    jobLogger.info('Job execution completed successfully');
  } catch (error) {
    console.error(error);
    jobLogger.error('Failed to execute the job: %s', error);

    try {
      await col.updateOne(idFilter, { $set: { status: 'failed' } });
    } catch (updateError) {
      jobLogger.error(
        'Failed to update the job status to "failed": %s',
        updateError
      );
    }
  }
}

function setupEvents() {
  const appEvents = cms().service('base::appEvents');

  appEvents.addHook('base::job::posted', ({ job }) => {
    void executeJob(job);
  });
}

async function runBacklog() {
  const pendingJobs = collection().find({
    $or: [{ status: 'pending' }, { status: 'in-progress' }],
  });

  for await (const job of pendingJobs) {
    await executeJob(job);
  }
}

export default service({
  lifecycle: {
    onPostInit: () => {
      setupEvents();
      void runBacklog();
    },
  },
  registerJob: <Id extends JobId>(id: Id, descriptor: JobDescriptor<Id>) => {
    descriptorRegistry[id] = descriptor as never;
  },
  postJob: async <Id extends JobId>(
    instance: Omit<JobInstance<Id>, 'status'>
  ) => {
    const data: JobInstance = {
      type: instance.type,
      data: instance.data as JobDataById<JobId>,
      status: 'pending',
    };

    const { insertedId } = await collection().insertOne(data);

    cms()
      .service('base::appEvents')
      .emit('base::job::posted', { job: { ...data, _id: insertedId } });
  },
});
