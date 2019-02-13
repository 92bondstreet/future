const fs = require('fs');
const path = require('path');

module.exports = (results, query) => {
  const raw = path.join(process.cwd(), 'output', `raw-${query}.json`);

  console.info(`💾 generate ${raw} raw file with ${results.length} potential links...`);
  fs.writeFileSync(raw, JSON.stringify(results, null, 2));
};
