import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { makeExecutableSchema } from 'graphql-tools';
import { graphql } from 'graphql';

import Actor from './Actor';
import AuthToken from './AuthToken';
import Database from './Database';
import Decision from './Decision';
import EducationExperience from './EducationExperience';
import Email from './Email';
import ExternalTask from './ExternalTask';
import ExternalTaskType from './ExternalTaskType';
import IPAddress from './IPAddress';
import Image from './Image';
import Industry from './Industry';
import JSON from 'graphql-type-json';
import Language from './Language';
import Location from './Location';
import Mutation from './Mutation';
import Organization from './Organization';
import Person from './Person';
import PersonName from './PersonName';
import PhoneNumber from './PhoneNumber';
import Product from './Product';
import Query from './Query';
import SocialProfile from './SocialProfile';
import Target from './Target';
import Timestamp from './Timestamp';
import URL from './URL';
import User from './User';
import Update from './Update';
import Website from './Website';
import WorkExperience from './WorkExperience';
import WorkRole from './WorkRole';
import Workflow from './Workflow';
import WorkflowSettings from './WorkflowSettings';

const DDL_GLOB = path.join(__dirname, '/ddl/**/*.graphql');
const typeDefs = glob.sync(DDL_GLOB).map(f => fs.readFileSync(f, 'utf-8'));

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Actor,
    AuthToken,
    Database,
    Decision,
    EducationExperience,
    Email,
    ExternalTask,
    ExternalTaskType,
    IPAddress,
    Image,
    Industry,
    JSON,
    Language,
    Location,
    Mutation,
    Organization,
    Person,
    PersonName,
    PhoneNumber,
    Product,
    Query,
    SocialProfile,
    Target,
    Timestamp,
    URL,
    Update,
    User,
    Website,
    WorkExperience,
    WorkRole,
    Workflow,
    WorkflowSettings
  }
});

export function execute(source, contextValue, variableValues) {
  return graphql(schema, source, null, contextValue, variableValues);
}
