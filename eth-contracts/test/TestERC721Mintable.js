// import "truffle/Assert.sol";
// import "truffle/DeployedAddresses.sol";
const ERC721Mintable = artifacts.require('ERC721Mintable');


// For random URIs
const faker = require('faker')


contract('ERC721Mintable', accounts => {

    // Using first account as designated owner
    const owner = accounts[0];

    const BN = web3.utils.BN;
    const tokenName = "House Token";
    const tokenSymbol = "HTX";
    const BASE_TOKEN_URI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

    // Config to spread tokens across multiple accounts
    const ACCOUNTS_TO_ISSUE = 3;
    const TOKENS_PER_ACCOUNT = 3;

    // Tracking coins
    let total_supply;
    let tokenId;
    let allTokenURI;

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            total_supply = 0;
            tokenId = 0;
            allTokenURI = {};
            // Setup multiple accounts and assign multiple coins to each
            this.contract = await ERC721Mintable.new(tokenName, tokenSymbol, {from: owner});
            try {
                // For each account..
                for (let acc = 1; acc <= ACCOUNTS_TO_ISSUE; acc++) {
                    // ..mint multiple tokens
                    let accURI = [];
                    for (let tokenCount = 1; tokenCount <= TOKENS_PER_ACCOUNT; tokenCount++) {
                        const tokenURI = faker.random.uuid();
                        await this.contract.mint(accounts[acc], ++tokenId, tokenURI);
                        accURI.push({tokenId, tokenURI ,fullURI:`${BASE_TOKEN_URI}${tokenURI}`});
                        total_supply++;
                    }
                    allTokenURI[acc] = (accURI)
                }
            } catch (e) {
                console.error(e)
            }
        });


        it('should return total supply', async function () {
            // ARRANGE
            let revert=false;
            let totalSupply = 0;

            // ACT
            try {
                const totalSupplyBN = await this.contract.totalSupply();
                totalSupply = new BN(totalSupplyBN).toString();
            } catch (e) {
                revert = true;
            }

            // ASSERT
            assert.equal(revert, false, `Should not revert`);
            assert.equal(totalSupply, total_supply, `Total amount of tokens stored by the contract should be ${totalSupply}`)
        });


        it('should get token balance', async function () {
            // ARRANGE
            let balanceOf = {};
            let revert=false;

            // ACT (for each account)
            try {
                for (let acc = 1; acc <= ACCOUNTS_TO_ISSUE; acc++) {
                    const balanceOfBN = await this.contract.balanceOf(accounts[acc]);
                    balanceOf[acc] = new BN(balanceOfBN).toString();
                }
            } catch (e) {
                revert = true;
            }

            // ASSERT
            assert.equal(revert, false, `Should not revert`);
            assert.equal(Object.keys(balanceOf).length, ACCOUNTS_TO_ISSUE, `Balances for all accounts should have been retrieved`)
            for (let acc = 1; acc <= ACCOUNTS_TO_ISSUE; acc++) {
                assert.equal(balanceOf[acc], TOKENS_PER_ACCOUNT, `Balance for account ${acc} should be ${TOKENS_PER_ACCOUNT}`)
            }
        });


        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            // ARRANGE
            let expectedTokenURI=[];
            let revert=false;

            // ACT
            try {
                Object.keys(allTokenURI).map(acc => {
                    const tokens = allTokenURI[acc];
                    tokens.map(({tokenId, tokenURI, fullURI}) => {
                        expectedTokenURI.push({acc, tokenId, tokenURI, fullURI});
                    })
                });
            } catch (e) {
                revert = true;
            }

            // ASSERT
            assert.equal(expectedTokenURI.length, ACCOUNTS_TO_ISSUE*TOKENS_PER_ACCOUNT, `All created tokens should have been retrieved`)
            expectedTokenURI.map(async ({acc, tokenId, tokenURI, fullURI}) => {
                let revert = false;
                let storedURI="";
                try {
                    storedURI = await this.contract.tokenURI(tokenId);
                } catch (e) {
                    revert = true;
                    console.log(e);
                }
                assert.equal(revert, false, `Should not revert`);
                assert.equal(storedURI, `${fullURI}`, `Token URI should be correct for a given token ID`)
            });
        });


        it('should transfer token from one owner to another', async function () {
            // ARRANGE
            const [account1,account2] = [accounts[1],accounts[2]];
            const from = account1;
            const to = account2;
            let revert = false;
            let ownerOf="";

            // ACT
            try {
                // Get the first token belonging to account 1..
                const tokenId = await this.contract.tokenOfOwnerByIndex(from, 0);
                // ..and attempt to transfer to account..
                await this.contract.transferFrom(from, to, tokenId,{from});
                // ..then retrieve new owner of token
                ownerOf = await this.contract.ownerOf(tokenId);
            } catch (e) {
                revert = true;
                console.error(e)
            }

            // ASSERT
            assert.equal(revert, false, `Should not revert`);
            assert.equal(ownerOf, account2, `Token ${tokenId} did not transfer from ${from} to ${to}`);
        })
    });


    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721Mintable.new(tokenName, tokenSymbol, {from: owner});
        });


        it('should fail when minting when address is not contract owner', async function () {
            // ARRANGE
            let revert=false;
            const unauthAccount = accounts[1];
            const tokenURI = faker.random.uuid();

            // ACT
            try {
                await this.contract.mint(unauthAccount, 999, tokenURI, {from: unauthAccount});
            } catch (e) {
                revert = true;
            }

            // ASSERT
            assert.notEqual(owner, unauthAccount, `Test configuration error! Owner and Unauth account are the same`);
            assert.equal(revert, true, `Should revert when account that attempts minting is NOT owner`);
        });


        it('should return contract owner', async function () {
            // ARRANGE
            let revert=false;
            let contractOwner="";

            //ACT
            try {
                contractOwner = await this.contract.owner();
            } catch (e) {
                revert = true;
            }

            // ASSERT
            assert.equal(revert, false, `Should not revert`);
            assert.equal(contractOwner, owner, `Should revert when account that attempts minting is NOT owner`);
        })

    });
});