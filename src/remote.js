const cheerio = require('cheerio');
const cleanTextUtils = require('clean-text-utils');
const fetch = require('node-fetch');
const Mercury = require('@postlight/mercury-parser');
const pLimit = require('p-limit');
const pSettle = require('p-settle');
const {P_LIMIT} = require('./constants');
const STARTUPS = require('../raw/startups.json');

/**
 * Compute size from string value
 * @param  {String} [value='']
 * @return {Number}
 */
const getBytes = (value = '') => {
  return Buffer.byteLength(value, 'utf8');
};

/**
 * Get list of jobpages
 * @return {Array}
 */
const jobpage = () => {
  return STARTUPS
    .map(startup => startup['Link to jobpage'])
    .filter(page => page !== '');
};

/**
 * Parse a given job page with Mercury
 * @param  {String} page
 * @return {String}
 */
const mercuryParse = async page => { //eslint-disable-line
  try {
    const response = await Mercury.parse(page, {'contentType': 'text'});

    return response;
  } catch (error) {
    console.error(error);
    return {};
  }
};

/**
 * Parse a given job page
 * @param  {String} page
 * @return {String}
 */
const parse = async page => {
  try {
    const response = await fetch(page);
    const body = await response.text();
    const $ = cheerio.load(body);

    let content = cleanTextUtils.strip.extraSpace($('body').text());

    content = cleanTextUtils.strip.newlines(content);
    content = cleanTextUtils.strip.nonASCII(content);

    return {
      content,
      'url': page
    };
  } catch (error) {
    console.error(error);
    return {};
  }
};

/**
 * Scrape and parse all startups job page
 * to index them into search engine
 *  * @return {Array}
 */
module.exports = async () => {
  const limit = pLimit(P_LIMIT);
  const pages = jobpage();
  const length = pages.length;

  console.log(`🕵️‍♀️  ${length} job pages found`);

  const promises = pages.map((page, index) => {
    return limit(async () => {
      console.log(`🔍 parsing job page ${index + 1}/${length}`);
      return await parse(page);
    });
  });

  const results = await pSettle(promises);
  const isFulfilled = results.filter(result => result.isFulfilled).map(result => result.value);
  const jobs = [].concat.apply([], isFulfilled);

  return jobs
    .filter(job => job.error !== true)
    .filter(job => job.url)
    .filter(job => getBytes(job.content) < 10240);
};
