import { BASE_URL } from '../config';
import { sendEmail } from './transport';

export function sendVerificationEmail(user) {
  return sendEmail({
    to: user.primaryEmail,
    subject: 'Verify your email with Pavlov 🐶',
    text: `Hi ${user.preferredName}, welcome to Pavlov!\n\nPlease verify your email address by following the link below:\n\n${BASE_URL}/verify/${user.emailVerificationCode}\n\nWith regards,\nthe Pavlov Team`
  });
}
