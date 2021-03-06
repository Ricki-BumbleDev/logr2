import { Reader, ContinentRecord, CountryRecord, CityRecord } from '@maxmind/geoip2-node';

const locate = async (ip: string) => {
  try {
    const ipLocator = await Reader.open('GeoLite2-City.mmdb');
    const ipLocationInfo = ipLocator.city(ip);
    return {
      location: {
        continent: ipLocationInfo.continent?.code,
        country: ipLocationInfo.country?.isoCode,
        region:
          ipLocationInfo.subdivisions?.length && ipLocationInfo.subdivisions.length >= 1
            ? ipLocationInfo.subdivisions?.[0].isoCode
            : undefined,
        city: (ipLocationInfo.city as CityRecord).names.en
      }
    };
  } catch {
    return { location: {} };
  }
};

export default locate;
