/** @flow */

import { MTurk } from '../index';
import AWS from 'aws-sdk-mock';

test('formats HIT questions', () => {
  const mturk = new MTurk();
  const question = mturk.formatQuestion('https://example.com', 480);
  expect(question).toContain('<ExternalURL>https://example.com</ExternalURL>');
  expect(question).toContain('<FrameHeight>480</FrameHeight>');
});

test('creates a HIT', async () => {
  const hitToken = Math.random().toString();
  const id = 'abc';
  const type = 'def';
  const createdAt = new Date('2017-11-03T21:38:10.761Z');
  const expiresAt = new Date('2018-11-03T21:38:10.761Z');

  AWS.mock('MTurk', 'createHIT', (params, callback) => {
    expect(params.Title).toBe('Lorem Ipsum');
    expect(params.Description).toBe('Dolor sit amet');
    expect(params.Reward).toBe('0.00');
    expect(params.AssignmentDurationInSeconds).toBe(60);
    expect(params.AutoApprovalDelayInSeconds).toBe(120);
    expect(params.Keywords).toBe('foo, bar');
    expect(params.LifetimeInSeconds).toBe(60 * 60);
    expect(params.MaxAssignments).toBe(1);
    expect(params.Question).toBe(question);
    expect(params.RequesterAnnotation).toBe(hitToken);
    expect(params.UniqueRequestToken).toBe(hitToken);
    callback(null, {
      HIT: {
        HITTypeId: type,
        HITId: id,
        CreationTime: createdAt,
        Expiration: expiresAt
      }
    });
  });

  const mturk = new MTurk();
  const question = mturk.formatQuestion('https://example.com', 480);
  const hitResponse = await mturk.createHIT(
    hitToken,
    question,
    'Lorem Ipsum',
    'Dolor sit amet',
    '0.00',
    ['foo', 'bar'],
    60 * 60,
    1,
    60,
    120
  );

  expect(hitResponse).toEqual({
    id,
    type,
    createdAt,
    expiresAt
  });
});
