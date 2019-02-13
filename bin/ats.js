const {es, google, save} = require('../src');
const {ATS_SAAS} = require('../src/constants');

const DEFAULT = {
  'limit': 100,
  'or': 1,
  'tabulation': 10
};

/**
 * Brower and index
 * @param  {Array} sites
 */
async function bin (argv) {
  try {
    const {clean, query} = argv;
    const configuration = Object.assign({}, DEFAULT, argv, {'sites': ATS_SAAS});
    const results = await google(configuration);

    save(results, query);

    if (clean) {
      await es.clean('future');
    }

    await es.bulk({results, query, 'index': 'future', 'type': 'ats'});
  } catch (e) {
    console.error(e);
  }
}

const argv = module.exports = require('yargs')
  .usage('usage: future  -c=<clean> -q=<query> -p=<proxy>')
  .option('clean', {
    'alias': 'c',
    'default': false,
    'demand': false,
    'description': 'clean search engine',
    'type': 'boolean'
  })
  .option('query', {
    'alias': 's',
    'demand': true,
    'description': 'Query to search on google',
    'type': 'string'
  })
  .option('proxy', {
    'alias': 'p',
    'default': 'localhost:8118',
    'demand': false,
    'description': 'Proxy for anonymous Google search',
    'type': 'string'
  })
  .strict()
  .locale('en')
  .wrap(120)
  .help('help')
  .argv;

bin(argv);
