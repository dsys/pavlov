import { getResizedImageURL } from '../images/urls';

export default {
  preferredName(userRow) {
    return userRow.preferredName || userRow.username;
  },
  thumbnailIcon(userRow) {
    return userRow.icon;
  },
  async thumbnailURL(userRow, args, { loaders }) {
    if (!userRow.iconImageId) return null;

    const imageRow = await loaders.image.load(userRow.iconImageId);
    if (!imageRow) return null;
    return getResizedImageURL(imageRow.sha256, 64);
  }
};
