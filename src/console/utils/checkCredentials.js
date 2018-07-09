/** @flow */

import q from '../db/queries';
import zxcvbn from 'zxcvbn';
import { adminPG } from '../db/postgres';
import emailAddresses from 'email-addresses';

const USERNAME_REGEXP = /^[a-zA-Z0-9_-]+$/;
const MIN_USERNAME_LENGTH = 4;
const MAX_USERNAME_LENGTH = 32;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

type CheckInviteCodeResult = {
  ok: boolean,
  database: Database
};

type CheckUsernameResult = {
  ok: boolean,
  warning: string
};

type CheckPasswordResult = {
  ok: boolean,
  strength: number,
  warning: string,
  suggestions: Array<string>
};

type CheckEmailResult = {
  ok: boolean,
  warning: string
};

export async function checkInviteCode(
  inviteCode: string
): Promise<CheckInviteCodeResult> {
  const database = await adminPG.oneOrNone(
    q.databases.selectByInviteCode,
    inviteCode
  );

  return { ok: !!database, database };
}

export async function checkUsername(
  username: string
): Promise<CheckUsernameResult> {
  if (username.length < MIN_USERNAME_LENGTH) {
    return {
      ok: false,
      warning: `Usernames must be at least ${MIN_USERNAME_LENGTH} characters long.`
    };
  } else if (username.length > MAX_USERNAME_LENGTH) {
    return {
      ok: false,
      warning: `Usernames must be at most ${MAX_USERNAME_LENGTH} characters long.`
    };
  } else if (!USERNAME_REGEXP.test(username)) {
    return {
      ok: false,
      warning: `Usernames must only contain alphanumeric characters, _, or -.`
    };
  } else {
    const anotherUser = await adminPG.oneOrNone(q.users.selectByUsername, {
      username
    });
    if (anotherUser) {
      return {
        ok: false,
        warning: 'That username is taken.'
      };
    } else {
      return { ok: true, warning: '' };
    }
  }
}

export function checkPassword(password: string): CheckPasswordResult {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      strength: 0,
      warning: `Passwords must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      suggestions: []
    };
  } else if (password.length > MAX_PASSWORD_LENGTH) {
    return {
      ok: false,
      strength: 5,
      warning: `Passwords must be at most ${MAX_PASSWORD_LENGTH} characters long.`,
      suggestions: []
    };
  } else {
    const result = zxcvbn(password);
    const ok = result.score >= 3;
    const strength = result.score / 4;
    const warning =
      result.feedback.warning === '' || result.feedback.warning.endsWith('.')
        ? result.feedback.warning
        : `${result.feedback.warning}.`;
    const suggestions = result.feedback.suggestions.map(
      s => (s.endsWith('.') ? s : `${s}.`)
    );

    return {
      ok,
      strength,
      warning: ok ? '' : warning || 'Password not strong enough.',
      suggestions
    };
  }
}

export async function checkEmail(
  databaseRow: any,
  email: string
): Promise<CheckEmailResult> {
  const parsed = emailAddresses.parseOneAddress(email);
  if (parsed && parsed.domain) {
    if (databaseRow.invite_email_domains.includes(parsed.domain)) {
      return { ok: true, warning: '', normalized: parsed.address };
    } else {
      const domains = databaseRow.invite_email_domains.join(', ');
      return {
        ok: false,
        warning: `Please use your work email. (${domains})`,
        normalized: null
      };
    }
  } else {
    return { ok: false, warning: 'Invalid email address.', normalized: null };
  }
}
