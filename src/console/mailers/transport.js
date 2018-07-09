/** @flow */

import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import {
  MAILGUN_DEFAULT_FROM,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN
} from '../config';

const MESSAGE_DEFAULTS = { from: MAILGUN_DEFAULT_FROM };

export const smtpTransport = nodemailer.createTransport(
  mg({
    auth: {
      api_key: MAILGUN_API_KEY,
      domain: MAILGUN_DOMAIN
    }
  })
);

export type EmailMessage = {|
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string
|};

export type EmailMessageInfo = {|
  messageId: string,
  envelope: Object,
  accepted: Array<string>,
  rejected: Array<string>,
  pending: Array<string>,
  response: string
|};

export async function sendEmail(
  message: EmailMessage
): Promise<EmailMessageInfo> {
  return new Promise((resolve, reject) => {
    const msg = { ...MESSAGE_DEFAULTS, ...message };
    smtpTransport.sendMail(msg, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}
