import { findUser } from '../db/auth';

export default {
  user(authToken) {
    return findUser(authToken.userId);
  }
};
