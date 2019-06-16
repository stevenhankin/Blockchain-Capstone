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
    mapping(uint => solution) private _solutions;


    // TODO Create an event to emit when a solution is added
    event Solution (uint hash);


    // TODO Create a function to add the solutions to the array and emit the event

//    function addSolution () {
//        _solutions[_hash] = ();
//        emit Solution(hash);
//    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly


}


// Interface
contract SquareVerifier {

}



















