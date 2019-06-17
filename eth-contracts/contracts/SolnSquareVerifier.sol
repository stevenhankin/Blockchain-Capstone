pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";


contract SolnSquareVerifier is ERC721Mintable {

    SquareVerifier squareVerifier;

    constructor(address verifierAddress, string memory name, string memory symbol) ERC721Mintable(name, symbol) public
    {
        // contract call to the Zokrates generated solidity Verifier contract
        squareVerifier = SquareVerifier(verifierAddress);
    }

    struct Solution {
        uint[2] a;
        uint[2][2] b;
        uint[2] c;
        uint[2] input;
        uint tokenId;
    }

    /**
     * @dev mapping to store unique solutions submitted
     */
    mapping(bytes32 => Solution) private _solutions;

    // Also store token id -> hash, to make lookup easier when minting
    mapping(uint => bytes32) private _tokenToSolution;

    // event to emit when a solution is added
    event SolutionAccepted (uint tokenId);

    // Function to add the solutions to the array and emit the event
    // a/b/c/input comes from Zokrates proof
    // token Id is the desired token to mint
    // 'to' will be the address token is assigned to
    function addSolution(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, uint tokenId) public {
        bytes32 hash = keccak256(abi.encodePacked(a, b, c, input));
        // Check if hash already exists
        Solution memory solution = _solutions[hash];
        require(solution.input[0] == 0 && solution.input[1] == 0, "Solution already used (not unique)");
        // Add new hash entry
        _solutions[hash] = Solution(a, b, c, input, tokenId);
        _tokenToSolution[tokenId] = hash;
        emit SolutionAccepted(tokenId);
    }


    // Function to mint new NFT only after the (unique) solution has been verified
    function mint(address to, uint256 tokenId, string memory tokenURI) public
    returns (bool){
        require(_tokenToSolution[tokenId] != 0, "Mint request denied: No proof has been supplied for token");
        return super.mint(to, tokenId, tokenURI);
    }


    // Function to mint without requiring Proof, for purpose of testing only
    function mintNoProofRequired(address to, uint256 tokenId, string memory tokenURI) public
    returns (bool){
        return super.mint(to, tokenId, tokenURI);
    }

}


// Interface
contract SquareVerifier {
    function mint(address to, uint256 tokenId, string memory tokenURI) public
    returns (bool);
}



















