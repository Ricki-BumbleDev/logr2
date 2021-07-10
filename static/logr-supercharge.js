const toConstantCase = s =>
  s
    .toString()
    .replace(/\.?([A-Z])/g, (_, y) => '_' + y)
    .replace(/^_/, '')
    .toUpperCase();

const supercharge = logr =>
  new Proxy(logr, {
    get: (target, name) => {
      if (name === 'log') {
        return target.log;
      } else if (name.startsWith('log')) {
        return (...params) => {
          const eventName = toConstantCase(name.substring(3));
          if (params.length === 0) {
            target.log(eventName);
          } else if (
            params.length === 1 &&
            (typeof params[0] === 'string' || typeof params[0] === 'number' || typeof params[0] === 'boolean')
          ) {
            target.log(eventName + '_' + toConstantCase(params[0]));
          } else if (params.length === 1 && Array.isArray(params[0])) {
            target.log(eventName, { meta: params[0] });
          } else if (params.length === 1 && typeof params[0] === 'object') {
            target.log(eventName, params[0]);
          } else {
            target.log(eventName, { meta: params });
          }
        };
      } else {
        return undefined;
      }
    }
  });
