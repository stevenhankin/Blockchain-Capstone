const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');


contract('SolnSquareVerifier', async (accounts) => {

    const owner = accounts[0];
    const to = accounts[1];
    const tokenId = 1;
    const name = "House Token";
    const symbol = "HTX";
    const tokenURI = "1122334455"

    // Take from the proof.json generated by Zokrates
    const proofJSON = {
        "proof": {
            "a": ["0x06d97881724399e353b76767a8018980045d12959271171b939bfa200728babd", "0x2c0299b05bedf3d0a41cb79da0427823c0093dde43915588762e88d7decdc7f1"],
            "b": [["0x10487796a19f8ff75ccdb86a1180fbb3c43c55a4929563faac11dcda7518e81a", "0x17ddf68c083cf538bc66467cf456ab88f4bf58874f872f2d6176c8671ff6642a"],
                ["0x2a720415fad5ced4f289d957ba6f79138f41f103368678faefb54816f21c3266", "0x07d48fbbd723a4180397cbea66ddd294f9c91f9919d0f67612371898123eb8a9"]],
            "c": ["0x052c54e54dc82fc5f6968d03d937eeae37ad4d6841bbb792a4d78400900a9949", "0x2f753d066a2c0618f080a7079855ab6faa1b334a910c8a9afc32533aa65b1e48"]
        },
        "inputs": ["0x000000000000000000000000000000000000000000000000000000000001bba1", "0x0000000000000000000000000000000000000000000000000000000000000001"]
    };
    const {proof, inputs} = proofJSON;
    const {a, b, c} = proof;


    describe('accepts proofs', function () {


        it('should accept a correct proof', async function () {
            // ARRANGE
            let revert = false;

            // ACT
            try {
                // Test if a new solution can be added for contract - SolnSquareVerifier
                this.contract = await SolnSquareVerifier.new(owner, name, symbol, {from: owner});
                await this.contract.addSolution(a, b, c, inputs, tokenId, {from: owner});
            } catch (e) {
                revert = true;
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
                // Adding the same solution a second time should fail
                await this.contract.addSolution(a, b, c, inputs, tokenId, {from: owner});
            } catch (e) {
                revert = true;
            }

            // ASSERT
            assert.equal(revert, true, `Should revert when proof already used`);
        })
    });


    describe('ERC721 token can be minted', async function() {

        it('should prevent token minting before proof supplied', async function () {
            // ARRANGE
            let revert = false;

            // ACT
            try {
                this.contract = await SolnSquareVerifier.new(owner, name, symbol, {from: owner});
                await this.contract.mint(to,tokenId,tokenURI,{from: owner});
            } catch (e) {
                revert = true;
            }

            // ASSERT
            assert.equal(revert, true, `Should revert`);
        });


        it('should allow token to be minted when correct proof supplied', async function () {
            // ARRANGE
            let revert = false;

            // ACT
            try {
                await this.contract.addSolution(a, b, c, inputs, tokenId, {from: owner});
                await this.contract.mint(to,tokenId,tokenURI,{from: owner});
            } catch (e) {
                revert = true;
                console.log(e);
            }

            // ASSERT
            assert.equal(revert, false, `Should not revert`);
        });

    });


});