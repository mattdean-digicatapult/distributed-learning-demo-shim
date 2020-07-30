const { ApiPromise, WsProvider } = require('@polkadot/api');
const fetch = require('node-fetch')

const wsProvider = new WsProvider('ws://127.0.0.1:9944');

const apiConfig = {
  provider: wsProvider,
  types: {
    // mapping the actual specified address format
    Address: 'AccountId',
    // mapping the lookup
    LookupSource: 'AccountId',
    // ML Model
    Model: {
      owner: 'AccountId',
      parent_block: 'Hash',
      model: 'Vec<u32>',
    }
  },
  rpc: {
    mlModelTracker: {
      getAggregateModel: {
        description: 'Gets the aggreagated model at the specific block',
        params: [
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'Vec<u32>'
      }
    }
  }
}

const run = async () => {
  const api = await ApiPromise.create(apiConfig);

  await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
    const model = (await api.rpc.mlModelTracker.getAggregateModel(lastHeader.hash)).map(bn => bn.toNumber());
    const result = {
      blockHash: lastHeader.hash.toString(),
      model
    };

    console.log(result)
    try {
      await fetch('http://localhost:8080/update_model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
      });
    } catch (err) {
      console.log(`Error POSTing result ${err.toString()}`)
    }
  })
};

module.exports = run
