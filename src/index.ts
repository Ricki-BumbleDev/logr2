import cookieParser from 'cookie-parser';
import express, { Request } from 'express';
import { nanoid } from 'nanoid';
import analyze, { AnalyzableReqParams, ReqAnalysisResult } from './analysis/index';
import { getCookieName, getSessionId } from './cookieName';
import getFingerprint from './getFingerprint';

const DISABLE_COOKIES = true;

const app = express();

type Event = {
  name: string;
} & any;

type Session = {
  userId?: string;
  sessionId: string;
  fingerprint: string;
  events: Event[];
  createdAt: Date;
} & ReqAnalysisResult;

const superCheapDb: Session[] = [];

const getParamsFromReq = (req: Request): AnalyzableReqParams => ({
  referer: req.get('Referrer')!,
  ip: (req.headers['x-forwarded-for'] as string) ?? req.socket.remoteAddress,
  userAgent: req.headers['user-agent']!,
  acceptLanguage: req.headers['accept-language']!
});

app.post('/api/v1/tracking', cookieParser(), express.json({ type: 'text/plain' }), async (req, res) => {
  const events = req.body;
  const analyzableReqParams = getParamsFromReq(req);
  let session: Session | undefined;
  let sessionId: string | undefined;
  let fingerprint: string;
  if (!DISABLE_COOKIES) {
    sessionId = getSessionId(req.cookies);
  }
  session = sessionId ? superCheapDb.find(session => session.sessionId === sessionId) : undefined;
  if (!session) {
    const { ip, userAgent, acceptLanguage } = analyzableReqParams;
    fingerprint = getFingerprint(ip, userAgent, acceptLanguage);
    session = superCheapDb.find(session => session.fingerprint === fingerprint);
    if (!session) {
      sessionId = nanoid();
      if (!DISABLE_COOKIES) {
        res.cookie(getCookieName(), sessionId);
      }
      const reqAnalysisResult = await analyze(analyzableReqParams);
      session = { sessionId, fingerprint, events: [], createdAt: new Date(), ...reqAnalysisResult };
      superCheapDb.push(session);
    }
  }
  session.events.push(...events);
  res.sendStatus(200);
});

app.get('/api/v1/tracking/report', (req, res) => res.json(superCheapDb));

app.use(express.static('static'));

app.listen(8080, () => console.log('Listening at http://localhost:8080'));
