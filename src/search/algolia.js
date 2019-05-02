const algoliasearch = require('algoliasearch');
const parseDomain = require('parse-domain');
const uuidv5 = require('uuid/v5');

const {ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY} = require('../constants');

let algolia = null;

const getIndex = module.exports.getIndex = async (key = ALGOLIA_API_KEY) => {
  if (algolia) {
    return algolia;
  }

  try {
    const client = algoliasearch(ALGOLIA_APPLICATION_ID, key);

    algolia = client.initIndex('ats');

    return algolia;
  } catch (error) {
    console.log(error);
    return {};
  }
};

/**
 * Bulk documents
 * @param  {Array}  documents
 * @return {Obbject}
 */
module.exports.bulk = async configuration => {
  try {
    const found = new Date();
    const {query, results} = configuration;
    const documents = results.map(result => {
      result.objectID = uuidv5(result.link, uuidv5.URL);
      result.found = found;
      result.domain = parseDomain(result.link).domain;

      Object.assign(result, {query});

      return result;
    });
    const index = await getIndex();
    const content = await index.addObjects(documents);

    return content;
  } catch (error) {
    console.error(error);
    return {};
  }
};
