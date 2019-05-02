const {remote, search} = require('../src');
const uuidv5 = require('uuid/v5');

/**
 * Brower and index
 * @param  {Array} sites
 */
async function bin () {
  try {
    const engine = search.algolia;
    const jobs = await remote();
    const documents = jobs.map(result => {
      result.objectID = uuidv5(result.url, uuidv5.URL);

      return result;
    });

    console.log(`🕵️‍♀️  ${documents.length} job pages with description found`);
    await engine.add(documents, 'remote');

    console.info('📡 search engine ready');
  } catch (e) {
    console.error(e);
  }
}

bin();
