import { UAParser } from 'ua-parser-js';

const parseUa = (userAgent: string) => {
  const userAgentInfo = new UAParser(userAgent);
  return {
    browser: {
      name: userAgentInfo.getBrowser().name,
      version: userAgentInfo.getBrowser().version
    },
    os: userAgentInfo.getOS(),
    device: userAgentInfo.getDevice()
  };
};

export default parseUa;
