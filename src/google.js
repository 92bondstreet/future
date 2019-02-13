const googleIt = require('google-it');
const pLimit = require('p-limit');
const pSettle = require('p-settle');
const url = require('url');

/**
 * Chunk array to small one
 * @param  {Array} items
 * @param  {Integer} size
 * @return {Array}
 */
const chunk = (items, size) => {
  const results = [];

  while (items.length) {
    results.push(items.splice(0, size));
  }

  return results;
};

/**
 * Get google query based on site:url.com OR site:url-i.com ...
 * @param  {Array} sites
 * @param  {String} query
 * @return {Object}
 */
const getQuery = (sites, query) => {
  const hostnames = [];

  let search = sites.reduce((value, site) => {
    const {hostname} = url.parse(site);

    hostnames.push(hostname);
    value += `site:${hostname} OR `;
    return value;
  }, '');

  search = search.replace(/ OR *$/gi, '');
  search = `(${search}) ${query}`;

  return {hostnames, search};
};

/**
 * search from different serp
 * @param  {String} query
 * @param  {String} proxy
 * @return {Promise}
 */
const search = (query, limit, proxy) => {
  const options = {
    limit,
    proxy,
    'no-display': true
  };

  return new Promise(async (resolve, reject) => {
    try {
      const results = await googleIt(Object.assign({}, {'query': query.search}, options));

      if (results.length) {
        console.info(`🕵🏾‍♀️  ${results.length} potential links from ${query.hostnames.join(', ')}...`);
      } else {
        console.warn(`🕵🏾‍♀️  nothing found from ${query.hostnames.join(', ')}...`);
      }

      return resolve(results);
    } catch (e) {
      console.error(`${e} from ${query.hostnames.join(', ')}`);
      return reject(e);
    }
  });
};

/**
 * Get the results of search query in headless way
 * @param  {Array} chunks
 * @param  {String} query
 */
const headlessify = async configuration => {
  const {chunks, proxy, query, tabulation} = configuration;
  const limit = pLimit(tabulation);

  console.debug('🖥️  searching in headless way, it could take time behind a proxy...');

  const queries = chunks.map(item => getQuery(item, query));
  const promises = queries.map(q => {
    return limit(() => search(q, configuration.limit, proxy));
  });

  const results = await pSettle(promises);
  const isFulfilled = results.filter(result => result.isFulfilled).map(result => result.value);

  console.info('🚀 Done');

  return [].concat.apply([], isFulfilled);
};

/**
 * Create the google query
 * @param  {Object} configuration
 * @return {Promise}
 */
module.exports = configuration => {
  const {or, query, sites, tabulation} = configuration;
  const chunks = chunk(Array.from(sites), or);
  const sessions = chunk(Array.from(chunks), tabulation);

  console.debug(`🍭 formatting ${sites.length} sites in ${chunks.length} queries - ${sessions.length} browser google sessions - for ${query}...`);

  return headlessify(Object.assign({}, {chunks}, configuration));
};
