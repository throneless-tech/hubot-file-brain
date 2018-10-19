// Description:
//   File brain for hubot
//
// Dependencies:
//   None
//
// Configuration:
//   HUBOT_FILEBRAIN_PATH
//
// Commands:
//   None
//
// Author:
//   Josh King <jking@chambana.net>, lightly modified from work by dustyburwell

const fs   = require('fs');
const path = require('path');

module.exports = function(robot) {
  let brainPath = process.env.HUBOT_FILEBRAIN_PATH || process.cwd();
  brainPath = path.join(brainPath, 'brain.json');
  try {
    const data = fs.readFileSync(brainPath, 'utf-8');
    if (data) {
      robot.brain.mergeData(JSON.parse(data));
    }
  } catch (error) {
    if (error.code !== 'ENOENT') { console.log('Unable to read file', error); }
  }
  // add the option Readable, will output an indented json
  return robot.brain.on('save', data => fs.writeFileSync(brainPath, JSON.stringify(data, null, 4), 'utf-8'));
};

