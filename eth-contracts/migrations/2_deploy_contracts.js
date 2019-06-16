// migrating the appropriate contracts
const ERC721Mintable = artifacts.require("./ERC721Mintable.sol");
const SquareVerifier = artifacts.require("./SquareVerifier.sol");
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer, network, accounts) {
  const name = "House Token";
  const symbol = "HTX";
  deployer.deploy(ERC721Mintable,name, symbol);
  deployer.deploy(SquareVerifier).then( () => {
    console.log('SquareVerifier.address',SquareVerifier.address);
    return deployer.deploy(SolnSquareVerifier, SquareVerifier.address, name, symbol);
  });
};
