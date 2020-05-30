import dns from 'dns';
import { promisify } from 'util';

const ispHostnameParts: Record<string, any> = {
  't-ipconnect': 'Telekom',
  'd1-online': 'Telekom',
  'vodafone-ip': 'Vodafone',
  wtnet: 'wilhelm.tel',
  amazonaws: 'Amazon AWS'
};

const invalidSecondLastHostnameParts = ['net', 'com', 'co', 'org', 'edu', 'me', 'gov', 'in', 'int'];

const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const formatHostnamePart = (hostnamePart: string) => {
  if (hostnamePart in ispHostnameParts) {
    return ispHostnameParts[hostnamePart];
  }
  if (hostnamePart.length <= 3) {
    return hostnamePart.toUpperCase();
  }
  return hostnamePart.split('-').map(capitalizeFirstLetter).join(' ');
};

const parseHostnames = (hostnames?: string[]) => {
  if (!(hostnames && hostnames[0])) {
    return undefined;
  }
  const hostnameParts = hostnames[0].split('.');
  if (hostnameParts.length < 2) {
    return undefined;
  }
  const secondLastHostnamePart = hostnameParts[hostnameParts.length - 2];
  return formatHostnamePart(
    !invalidSecondLastHostnameParts.includes(secondLastHostnamePart)
      ? secondLastHostnamePart
      : hostnameParts[hostnameParts.length - 3]
  );
};

const findIsp = async (ip: string) => {
  try {
    const hostnames = await promisify(dns.reverse)(ip);
    return { hostnames, isp: parseHostnames(hostnames) };
  } catch {
    return { hostnames: [], isp: undefined };
  }
};

export default findIsp;
