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
  brainPath = path.resolve(brainPath, 'brain.json');
  robot.logger.debug("Loading file-backed brain from ", brainPath);
  fs.promises.access(brainPath, fs.constants.R_OK | fs.constants.W_OK).then(() => {
    fs.promises.readFile(brainPath, 'utf-8').then(data => {
      robot.logger.debug("Merging saved data.");
      robot.brain.mergeData(JSON.parse(data));
    });
  }).catch(error => {
    if (error.code !== 'ENOENT') {
      robot.logger.error('Unable to read file', error);
    } else {
      robot.brain.mergeData({});
    }
  });
  // add the option Readable, will output an indented json
  return robot.brain.on('save', data => {
    fs.writeFileSync(brainPath, JSON.stringify(data, null, 4), 'utf-8');
  });
};

