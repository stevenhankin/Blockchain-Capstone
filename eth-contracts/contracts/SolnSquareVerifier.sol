pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable {

    SquareVerifier squareVerifier;

    constructor(address verifierAddress, string memory name, string memory symbol) ERC721Mintable(name, symbol) public
    {
        // TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
        squareVerifier = SquareVerifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint _index;
        address _address;
    }

//     TODO define an array of the above struct
//    solutions[] storage mySolutions;

    // TODO define a mapping to store unique solutions submitted
    /**
     * @dev mapping to store unique solutions submitted
     */
    mapping(bytes32 => Solution) private _solutions;


    // TODO Create an event to emit when a solution is added
    event SolutionAccepted (uint _index, address _address);

    function _getHash(string memory inputA, string memory inputB) private pure
    returns (bytes32)
    {
        return keccak256(abi.encodePacked(sha256(abi.encodePacked(inputA, inputB))));
    }

    // Utility to check whether a solution exists for an input pair
    function getSolution (string memory inputA, string memory inputB) public view
    returns (uint, address)
    {
        bytes32 hash = _getHash(inputA, inputB);
        Solution memory solution = _solutions[hash];
        return (solution._index, solution._address);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution (string memory inputA, string memory inputB, uint index, address anAddress) public {
        bytes32 hash = _getHash(inputA, inputB);
        Solution memory solution = _solutions[hash];
        require (solution._address == address(0), "Solution already mapped");
        _solutions[hash] =  Solution (index, anAddress);
        emit SolutionAccepted(index, anAddress);
    }


    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
    function mint(address to, uint256 tokenId, string memory tokenURI) public
    returns (bool){
        return squareVerifier.mint(to, tokenId, tokenURI); //
    }

}


// Interface
contract SquareVerifier {
    function mint(address to, uint256 tokenId, string memory tokenURI) public
    returns (bool);
}



















