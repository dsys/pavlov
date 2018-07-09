import log from '../log';
import _ from 'lodash';
import workflowsQueue from './workflowsQueue';

const queues = {
  workflowsQueue
};

const attachLoggingListeners = queue => {
  queue.on('active', (job, promise) => {
    log.info(
      `${job.name} job[${job.id}] started on ${queue.name} queue with data ${JSON.stringify(
        job.data,
        null,
        2
      )}`
    );
  });

  queue.on('progress', (job, progress) => {
    log.info(`${job.name} job[${job.id}] job made progress`, progress);
  });

  queue.on('failed', (job, err) => {
    log.error(err, `${job.name} job[${job.id}] failed`);
  });

  queue.on('completed', (job, result) => {
    log.info(`${job.name} job[${job.id}] completed`, result);
  });
};

_.each(queues, attachLoggingListeners);

export default queues;
