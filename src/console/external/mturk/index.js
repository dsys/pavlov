/** @flow */
/* eslint flowtype/space-after-type-colon:"off" */

import AWS from 'aws-sdk';
import _ from 'lodash';
import log from '../../log';

export type MTurkClient = Object;

export type HITResponse = {
  type: string,
  id: string,
  createdAt: Date,
  expiresAt: Date
};

type _BaseQualificationType = {
  Name?: string,
  Description?: string,
  Keywords?: string,
  QualificationTypeStatus: 'Active' | 'Inactive',
  RetryDelayInSeconds?: number,
  Test?: string,
  TestDurationInSeconds?: number,
  AnswerKey?: string,
  AutoGranted?: boolean,
  AutoGrantedValue?: number,
  IsRequestable?: boolean
};

export type QualificationTypeSpec = _BaseQualificationType & {
  Name: string,
  TestXMLPath?: string,
  TestDurationInSeconds?: number,
  AnswerKeyXMLPath?: string
};

export type QualificationType = _BaseQualificationType & {
  QualificationTypeId: string,
  CreationTime: Date
};

export type QualificationRequirement = {
  Comparator:
    | 'LessThan'
    | 'LessThanOrEqualTo'
    | 'GreaterThan'
    | 'GreaterThanOrEqualTo'
    | 'EqualTo'
    | 'NotEqualTo'
    | 'Exists'
    | 'DoesNotExist'
    | 'In'
    | 'NotIn',
  QualificationTypeId: string,
  IntegerValues: Array<number>,
  RequiredToPreview?: boolean
};

export const AWS_API_VERSION = '2017-01-17';

export const AWS_MTURK_ENDPOINT = __DEV__
  ? 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
  : 'https://mturk-requester.us-east-1.amazonaws.com';

export const AWS_REGION = 'us-east-1';

/* Only these specific fields can be updated for a QualificationType */
const QualificationTypeUpdateFields = [
  'QualificationTypeId',
  'RetryDelayInSeconds',
  'QualificationTypeStatus',
  'Description',
  'Test',
  'AnswerKey',
  'TestDurationInSeconds',
  'AutoGranted',
  'AutoGrantedValue'
];

const DEFAULT_QUALIFICATION_TYPE_NAME = 'Image Content Moderation';

export function createClient(
  {
    apiVersion = AWS_API_VERSION,
    endpoint = AWS_MTURK_ENDPOINT,
    region = AWS_REGION
  }: {
    apiVersion: string,
    endpoint: string,
    region: string
  } = {}
): MTurkClient {
  return new AWS.MTurk({
    apiVersion,
    endpoint,
    region
  });
}

export class MTurk {
  constructor(...args) {
    this.client = createClient(...args);
  }

  /**
   * Formats an ExternalQuestion XML for Mechanical Turk.
   */
  formatQuestion(externalURL: string, frameHeight: number): string {
    return `
  <ExternalQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd">
    <ExternalURL>${externalURL}</ExternalURL>
    <FrameHeight>${frameHeight}</FrameHeight>
  </ExternalQuestion>
    `.trim();
  }

  /**
   * Creates a HIT according to the provided settings.
   *
   * @todo: Make the HIT review policy configurable.
   */
  async createHIT(
    hitToken: string,
    question: string,
    title: string,
    description: string,
    reward: string,
    keywords: Array<string>,
    lifetime: number,
    maxAssignments: number,
    assignmentDuration: number,
    autoApprovalDelay: number
  ): Promise<HITResponse> {
    let params = {
      Title: title,
      Description: description,
      Reward: reward,
      AssignmentDurationInSeconds: assignmentDuration,
      AutoApprovalDelayInSeconds: autoApprovalDelay,
      Keywords: keywords.join(', '),
      LifetimeInSeconds: lifetime,
      MaxAssignments: maxAssignments,
      Question: question,
      RequesterAnnotation: hitToken,
      UniqueRequestToken: hitToken
    };

    try {
      const allQualificationTypes = await this.fetchExistingQualificationTypes();
      const qt = _.find(allQualificationTypes, {
        Name: DEFAULT_QUALIFICATION_TYPE_NAME
      });
      if (qt) {
        const qtId = qt['QualificationTypeId'];
        params['QualificationRequirements'] = [
          {
            QualificationTypeId: qtId,
            Comparator: 'GreaterThanOrEqualTo',
            IntegerValues: [70]
          }
        ];
      }
    } catch (err) {
      log.err(err);
    }

    const createHITRaw = await this.client.createHIT(params).promise();

    return {
      type: createHITRaw.HIT.HITTypeId,
      id: createHITRaw.HIT.HITId,
      createdAt: createHITRaw.HIT.CreationTime,
      expiresAt: createHITRaw.HIT.Expiration
    };
  }

  /**
   * Returns a list of qualification types created by this AWS user
   */
  async fetchExistingQualificationTypes(): Promise<Array<QualificationType>> {
    const res = await this.client
      .listQualificationTypes({
        MustBeRequestable: false /* required */,
        MaxResults: 100,
        MustBeOwnedByCaller: true
      })
      .promise();
    return res['QualificationTypes'];
  }

  async createQualificationType(
    typeSpec: QualificationTypeSpec
  ): Promise<QualificationType> {
    const res = await this.client.createQualificationType(typeSpec).promise();
    return res['QualificaitonType'];
  }

  async updateQualificationType(
    typeSpec: QualificationTypeSpec
  ): Promise<QualificationType> {
    const res = await this.client.updateQualificationType(typeSpec).promise();
    return res['QualificationType'];
  }

  async upsertQualificationTypes(
    typeSpecs: Array<QualificationTypeSpec> | QualificationTypeSpec
  ): Promise<Array<QualificaitonType>> {
    typeSpecs = _.flatten([typeSpecs]);
    const existingQTs = await this.fetchExistingQualificationTypes();
    const newQTSpecs = _.differenceBy(typeSpecs, existingQTs, 'Name');
    const updatedQTSpecs = _.compact(
      _.map(typeSpecs, ts => {
        const existingQT = _.find(existingQTs, { Name: ts['Name'] });
        if (existingQT && _.find(ts, (val, key) => existingQT[key] != val)) {
          return _.pick(_.merge(existingQT, ts), QualificationTypeUpdateFields);
        }
      })
    );
    return Promise.all(
      _.flatten([
        newQTSpecs.map(qts => {
          return this.createQualificationType(qts);
        }),
        updatedQTSpecs.map(qts => {
          return this.updateQualificationType(qts);
        })
      ])
    );
  }
}
