const es = require('./src/es');
const google = require('./src/google');
const save = require('./src/save');

async function sandbox () {
  const sites = ['site:jobs.lever.co'];
  const query = 'javascript+engineer+remote';
  const configuration = {
    query,
    sites,
    'limit': 100,
    'or': 1,
    'tabulation': 10,
    'proxy': 'localhost:8118'
  };

  const results = await google(configuration);

  save(results, query);
  //await es.clean('future');
  await es.bulk({results, query, 'index': 'future', 'type': 'ats'});
}

sandbox();
