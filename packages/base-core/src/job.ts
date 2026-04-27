import { GetPropertyOr, MaybePromise, RetryOptions } from '@game-cms/shared';

export interface JobTypeRegistry {}

export type JobId = keyof JobTypeRegistry extends never
  ? string
  : keyof JobTypeRegistry;

type JobTypeInfoById<Id extends JobId> = GetPropertyOr<
  JobTypeRegistry,
  Id,
  unknown
>;

export type JobDataById<Id extends JobId> = GetPropertyOr<
  JobTypeInfoById<Id>,
  'data',
  unknown
>;

export type JobStatus = 'pending' | 'in-progress' | 'failed';

export type JobInstance<Id extends JobId = JobId> = {
  type: Id;
  status: JobStatus;
  data: JobDataById<Id>;
};

export type JobDescriptor<Id extends JobId = JobId> = {
  retry: false | RetryOptions;
  execute: (data: JobDataById<Id>) => MaybePromise<void>;
};

export type JobDescriptorMap = {
  [Id in JobId]: JobDescriptor<Id>;
};
