const app = require('./server')
const mkServer = require('./server')
const setupSubstrate = require('./substrate')

const run = async () => {
  const app = await mkServer();
  await setupSubstrate(app);
  app.listen(3000, () => console.log('listening on port 3000!'));
}

module.exports = run
