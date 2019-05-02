require('dotenv').config();

const {env} = process;
const {ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY, ES_HOST = 'http://localhost:9200'} = env;

const ATS_SAAS = [
  'https://jobs.lever.co',
  'https://boards.greenhouse.io',
  'https://workable.com',
  'https://smartrecruiters.com',
  'https://recruitee.com',
  'https://breezy.hr',
  'https://jobs.jobvite.com',
  'https://welcomekit.co'
];

module.exports = {
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_API_KEY,
  ATS_SAAS,
  ES_HOST
};
