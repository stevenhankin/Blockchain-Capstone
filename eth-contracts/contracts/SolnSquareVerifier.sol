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
    struct solution {
        uint _index;
        address _address;
    }

//     TODO define an array of the above struct
//    solutions[] storage mySolutions;

    // TODO define a mapping to store unique solutions submitted
    /**
     * @dev mapping to store unique solutions submitted
     */
    mapping(bytes32 => solution) private _solutions;


    // TODO Create an event to emit when a solution is added
    event Solution (uint _index, address _address);


    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution (string memory inputA, string memory inputB, uint index, address anAddress) public {
        bytes32 hash = keccak256(abi.encodePacked(sha256(abi.encodePacked(inputA, inputB))));
        require (_solutions[hash]._index == 0, "Solution already mapped");
        _solutions[hash] =  solution (index, anAddress);
        emit Solution(index, anAddress);
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



















