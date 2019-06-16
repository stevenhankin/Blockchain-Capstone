const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');


contract('SolnSquareVerifier', async (accounts) => {

    const owner = accounts[0]

    describe('accepts proofs', function () {

        const [inputA, inputB] = [ "3" , "9"];
        const anAddress = owner;
        const index = 1;
        const name = "House Token";
        const symbol = "HTX";

        it('should accept a correct proof', async function () {
            // ARRANGE
            let revert = false;

            // ACT
            try {
                // Test if a new solution can be added for contract - SolnSquareVerifier
                    this.contract = await SolnSquareVerifier.new(owner, name, symbol, {from: owner});
                    result = await this.contract.addSolution(inputA, inputB, index, anAddress);
                } catch (e) {
                revert=true;
                console.log(e);
            }

            // ASSERT
            assert.equal(revert, false, `Should not revert`);
        });


        it('should reject a proof if it has already been used', async function () {
            // ARRANGE

            let revert = false;

            // ACT
            try {
                // Test if a new solution can be added for contract - SolnSquareVerifier
                this.contract = await SolnSquareVerifier.new(owner, name, symbol, {from: owner});
                await this.contract.addSolution(inputA, inputB, index, anAddress);
            } catch (e) {
                revert=true;
            }

            // ASSERT
            assert.equal(revert, true, `Should revert when proof already used`);
        })
    });



// Test if an ERC721 token can be minted for contract - SolnSquareVerifier


});