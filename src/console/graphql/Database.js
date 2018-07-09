import { BASE_URL } from '../config';
import { getResizedImageURL } from '../images/urls';

export default {
  schema(database, args, { sandbox }) {
    return sandbox.findDatabaseSchema(database);
  },
  inviteURL(database) {
    return `${BASE_URL}/register?inviteCode=${database.inviteCode}`;
  },
  thumbnailIcon(databaseRow) {
    return databaseRow.icon;
  },
  async thumbnailURL(databaseRow, args, { loaders }) {
    if (!databaseRow.iconImageId) return null;

    const imageRow = await loaders.image.load(databaseRow.iconImageId);
    if (!imageRow) return null;
    return getResizedImageURL(imageRow.sha256, 64);
  }
};
