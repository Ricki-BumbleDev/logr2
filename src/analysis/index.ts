import findIsp from './findIsp';
import locate from './locate';
import parseUa from './parseUa';

export type AnalyzableReqParams = {
  ip: string;
  userAgent: string;
  acceptLanguage: string;
  referer: string;
};

export type ReqAnalysisResult = {
  ip: string;
  hostnames: string[];
  provider?: string;
  browser: {
    name?: string;
    version?: string;
  };
  os: {
    name?: string;
    version?: string;
  };
  device: {
    model?: string;
    type?: string;
    vendor?: string;
  };
  fullUserAgent: string;
  location: {
    continent?: 'AF' | 'AN' | 'AS' | 'EU' | 'NA' | 'OC' | 'SA';
    country?: string;
    region?: string;
    city?: string;
  };
  acceptLanguage: string;
  referer: string;
};

const analyze = async ({ ip, userAgent, acceptLanguage, referer }: AnalyzableReqParams): Promise<ReqAnalysisResult> => {
  const userAgentInfo = parseUa(userAgent);
  const [locationInfo, ispInfo] = await Promise.all([locate(ip), findIsp(ip)]);
  return {
    ip,
    hostnames: ispInfo.hostnames,
    provider: ispInfo.isp,
    ...locationInfo,
    fullUserAgent: userAgent,
    ...userAgentInfo,
    acceptLanguage,
    referer
  };
};

export default analyze;
