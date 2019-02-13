const elasticsearch = require('elasticsearch');
const parseDomain = require('parse-domain');
const uuidv5 = require('uuid/v5');

const esClient = new elasticsearch.Client({
  'host': 'http://localhost:9200',
  'log': 'error'
});

module.exports.clean = async indices => {
  try {
    const response = await esClient.indices.delete({'index': indices});

    console.log(
      `🚀 Successfully delete indices ${indices}: ${JSON.stringify(
        response,
        null,
        2
      )}`
    );
  } catch (e) {
    console.error(e.message || e);
  }
};

/**
 * Index results from stockx api params
 * @param  {Object} configuration
 */
module.exports.bulk = async configuration => {
  const {index, query, results, type} = configuration;
  const bulks = results.map(result => {
    result.found = new Date();
    result.domain = parseDomain(result.link).domain;

    Object.assign(result, {query});

    return [
      {
        'create': {
          '_index': index,
          '_id': uuidv5(result.link, uuidv5.URL),
          '_type': type
        }
      },
      result
    ];
  });
  const indexes = [].concat(...bulks);

  try {
    const response = await esClient.bulk({'body': indexes});
    const errors = response.items
      .filter(item => item.index && item.index.error)
      .map(value => JSON.stringify(value, null, 2));

    console.error(errors.join('\n'));
    console.info(
      `🚀 Successfully indexed ${response.items.length - errors.length} out of ${
        results.length
      } items`
    );
  } catch (e) {
    console.error(e);
  }
};
