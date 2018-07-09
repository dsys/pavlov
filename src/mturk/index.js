/* eslint no-console:"off" */

'use strict';
import 'babel-core/register';
import 'babel-polyfill';
import { MTurk } from '../console/external/mturk';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const TYPE_SPECS_PATH = path.join(__dirname, '/qualificationTypeSpecs.json');

const main = async () => {
  const mturk = new MTurk();
  const qualificationTypeSpecs = JSON.parse(fs.readFileSync(TYPE_SPECS_PATH))
    .QualificationTypeSpecs;
  _.each(qualificationTypeSpecs, qts => {
    if (qts['TestXMLPath']) {
      const testXMLString = fs
        .readFileSync(path.join(__dirname, qts['TestXMLPath']))
        .toString();
      const answerKeyXMLString = fs
        .readFileSync(path.join(__dirname, qts['AnswerKeyXMLPath']))
        .toString();
      qts['Test'] = testXMLString;
      qts['AnswerKey'] = answerKeyXMLString;
      delete qts['TestXMLPath'];
      delete qts['AnswerKeyXMLPath'];
    }
  });
  try {
    const allQualificationTypes = await mturk.fetchExistingQualificationTypes();
    console.log(
      `\n\nAll QualificationTypes: ${_.map(
        allQualificationTypes,
        qt => qt['Name']
      )}`
    );

    const updatedQualificationTypes = await mturk.upsertQualificationTypes(
      qualificationTypeSpecs
    );
    console.log(
      `Updated QualificaitonTypes: ${_.map(
        updatedQualificationTypes,
        qt => qt['Name']
      )}`
    );

    const qt = _.find(allQualificationTypes, {
      Name: 'Image Moderation Rough Draft 8'
    });

    const createHITRes = await mturk.client
      .createHIT({
        Title: qt.Name,
        Description: 'TESTING CUSTOM QUALIFICATIONS',
        Reward: '0.0',
        AssignmentDurationInSeconds: 300,
        Keywords: 'test',
        LifetimeInSeconds: 3000,
        MaxAssignments: 999,
        Question: fs
          .readFileSync(path.join(__dirname, 'Question.xml'))
          .toString(),
        QualificationRequirements: [
          {
            QualificationTypeId: qt['QualificationTypeId'],
            Comparator: 'GreaterThan',
            IntegerValues: [0]
          }
        ]
      })
      .promise();
    console.log(createHITRes);
  } catch (err) {
    console.log(err);
  }
};
main();
