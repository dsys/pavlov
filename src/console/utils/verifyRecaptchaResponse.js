import fetch from 'node-fetch';

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export default async function verifyRecaptchaResponse(recaptchaResponse) {
  const reqBody = `secret=${encodeURIComponent(
    RECAPTCHA_SECRET
  )}&response=${encodeURIComponent(recaptchaResponse)}`;
  const res = await fetch(RECAPTCHA_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: reqBody
  });
  const resBody = await res.json();
  return resBody.success;
}
