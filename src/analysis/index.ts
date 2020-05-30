import parseUa from './parse-ua';
import locate from './locate';
import findIsp from './find-isp';

export interface AnalyzableReqParams {
  userAgent: string;
  ip: string;
  referer: string;
}

const analyze = async (params: AnalyzableReqParams) => {
  const userAgentInfo = parseUa(params.userAgent);
  const [locationInfo, ispInfo] = await Promise.all([locate(params.ip), findIsp(params.ip)]);
  return {
    referer: params.referer,
    ip: params.ip,
    hostnames: ispInfo.hostnames,
    provider: ispInfo.isp,
    ...locationInfo,
    fullUserAgent: params.userAgent,
    ...userAgentInfo
  };
};

export default analyze;
