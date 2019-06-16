// migrating the appropriate contracts
const ERC721Mintable = artifacts.require("./ERC721Mintable.sol");
const SquareVerifier = artifacts.require("./SquareVerifier.sol");
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
  // Arbitrary configuration
  const name = "House Token";
  const symbol = "HTX";
  deployer.deploy(ERC721Mintable,name, symbol);
  deployer.deploy(SquareVerifier).then( () => {
    return deployer.deploy(SolnSquareVerifier, SquareVerifier.address, name, symbol);
  });
};
