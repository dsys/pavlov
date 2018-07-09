/** @flow */

import moment from 'moment';
import { NotFoundError } from '../errors';
import { encodeId } from '../identifiers';
import { getActorDisplay } from '../actors';
import { getLocationDisplay } from '../locations/display';
import { getResizedImageURL } from '../images/urls';

import type { GraphQLContext } from './context';
import type {
  ActorRow,
  DecisionRow,
  ExternalTaskRow,
  ImageEntityRow,
  IPAddressEntityRow,
  WorkflowRow,
  TargetRow
} from '../rows';

export default {
  id(targetRow: TargetRow): string {
    return encodeId('TRG', targetRow.id);
  },
  async thumbnailURL(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ) {
    let imageRow = null;
    if (targetRow.actor_id) {
      const actorRow = await loaders.actor.load(targetRow.actor_id);
      if (!actorRow || !actorRow.person_id) return null;
      const imageRows = await loaders.imagesByPersonId.load(actorRow.person_id);
      if (imageRows.length === 0) return null;
      imageRow = imageRows[0];
    } else if (targetRow.image_id) {
      imageRow = await loaders.image.load(targetRow.image_id);
      if (!imageRow) return null;
    } else {
      return null;
    }

    return getResizedImageURL(imageRow.sha256, 64);
  },
  thumbnailIcon(targetRow: TargetRow) {
    if (targetRow.actor_id) {
      return 'user';
    } else if (targetRow.image_id) {
      return 'image';
    } else if (targetRow.label === 'HEADS') {
      return 'up';
    } else if (targetRow.label === 'TAILS') {
      return 'down';
    } else {
      return 'run';
    }
  },
  async title(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<string> {
    if (targetRow.display != null) {
      return targetRow.display;
    } else if (targetRow.aliases && targetRow.aliases.length > 0) {
      return targetRow.aliases.join(', ');
    } else if (targetRow.actor_id) {
      const actorRow = await loaders.actor.load(targetRow.actor_id);
      if (actorRow) {
        return getActorDisplay(loaders, actorRow);
      }
    } else if (targetRow.ip_address_id) {
      const ipAddressRow = await loaders.ipAddress.load(
        targetRow.ip_address_id
      );
      if (ipAddressRow) {
        return ipAddressRow.ip_address;
      }
    }

    const workflowRow = await loaders.workflow.load(targetRow.workflow_id);
    if (workflowRow) {
      const friendlyTime = moment(targetRow.created_at).format(
        'dddd, MMMM Do YYYY, h:mm:ss a'
      );
      return `${workflowRow.name} on ${friendlyTime}`;
    } else {
      return '';
    }
  },
  async subtitle(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<string> {
    if (targetRow.ip_address_id) {
      const ipAddressRow = await loaders.ipAddress.load(
        targetRow.ip_address_id
      );
      if (ipAddressRow && ipAddressRow.location_id) {
        const locationRow = await loaders.location.load(
          ipAddressRow.location_id
        );
        if (locationRow) {
          return getLocationDisplay(locationRow);
        }
      }
    }

    return targetRow.reasons.join(', ');
  },
  image(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?ImageEntityRow> {
    return targetRow.image_id
      ? loaders.image.load(targetRow.image_id)
      : Promise.resolve(null);
  },
  actor(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?ActorRow> {
    return targetRow.actor_id
      ? loaders.actor.load(targetRow.actor_id)
      : Promise.resolve(null);
  },
  ipAddress(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?IPAddressEntityRow> {
    return targetRow.ip_address_id
      ? loaders.ipAddress.load(targetRow.ip_address_id)
      : Promise.resolve(null);
  },
  hasActor(targetRow: TargetRow): boolean {
    return !!targetRow.actor_id;
  },
  hasImage(targetRow: TargetRow): boolean {
    return !!targetRow.image_id;
  },
  hasIPAddress(targetRow: TargetRow): boolean {
    return !!targetRow.ip_address_id;
  },
  async workflow(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<WorkflowRow> {
    const workflowRow = await loaders.workflow.load(targetRow.workflow_id);
    if (workflowRow) {
      return workflowRow;
    } else {
      throw new NotFoundError('workflow not found');
    }
  },
  async updates(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<DecisionRow>> {
    const updateRow = await loaders.updatesByTargetId.load(targetRow.id);
    if (updateRow) {
      return updateRow;
    } else {
      throw new NotFoundError('update not found');
    }
  },
  externalTasks(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<ExternalTaskRow>> {
    return loaders.externalTasksByTargetId.load(targetRow.id);
  },
  async decisions(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<DecisionRow>> {
    const decisionRow = await loaders.decisionsByTargetId.load(targetRow.id);
    if (decisionRow) {
      return decisionRow;
    } else {
      throw new NotFoundError('decision not found');
    }
  },
  async label(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?string> {
    return targetRow.label;
  },
  async score(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?number> {
    return targetRow.score;
  },
  async reasons(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?Array<string>> {
    return targetRow.reasons;
  },
  aliases(
    targetRow: TargetRow,
    args: {},
    { loaders }: GraphQLContext
  ): Array<string> {
    return targetRow.aliases || [];
  },
  environment(targetRow: TargetRow) {
    return targetRow.environment;
  },
  createdAt(targetRow: TargetRow): Date {
    return targetRow.created_at;
  },
  updatedAt(targetRow: TargetRow): Date {
    return targetRow.updated_at;
  }
};
