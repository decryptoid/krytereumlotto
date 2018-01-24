module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gasPrice: 5000000000, // Specified in Wei
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0x6facF8FDb850B1Ef755C99f6d73a3B0dEa6633Dc", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388, // Gas limit used for deploys
      gasPrice: 5000000000 // Specified in Wei
    }
  }
};
