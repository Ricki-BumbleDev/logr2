import crypto from 'crypto';

const hash = (payload: string) => crypto.createHash('sha256').update(payload).digest('hex');

const getFingerprint = (ip: string, userAgent: string, acceptLanguage: string) =>
  hash([ip, userAgent, acceptLanguage].join(':'));

export default getFingerprint;
