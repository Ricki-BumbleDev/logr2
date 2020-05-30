import cookieParser from 'cookie-parser';
import express, { Request } from 'express';
import { nanoid } from 'nanoid';
import analyze, { AnalyzableReqParams } from './analysis/index';

const app = express();

const superCheapDb: any[] = [];

const getParamsFromReq = (req: Request): AnalyzableReqParams => ({
  referer: req.get('Referrer')!,
  ip: (req.headers['x-forwarded-for'] as string) ?? req.connection.remoteAddress,
  userAgent: req.headers['user-agent']!
});

app.post('/api/v1/tracking', cookieParser(), express.json({ type: 'text/plain' }), async (req, res) => {
  let sessionId = req.cookies.sessionId;
  if (!sessionId) {
    sessionId = nanoid();
    res.cookie('sessionId', sessionId);
    console.log(`NEW SESSION ${sessionId}`);
  }
  const requestAnalysisResult = await analyze(getParamsFromReq(req));
  superCheapDb.push(...req.body.map((event: any) => ({ ...event, sessionId, ...requestAnalysisResult })));
  console.log(`LOGGED ${req.body.length} EVENTS`);
  res.sendStatus(200);
});

app.get('/api/v1/tracking/report', (req, res) => res.json(superCheapDb));

app.use(express.static('static'));

app.listen(8080, () => console.log('Listening at http://localhost:8080'));
