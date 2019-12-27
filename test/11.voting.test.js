const Ballot = artifacts.require("Ballot");
const { expectRevert, constants, BN} = require('@openzeppelin/test-helpers');
contract("Ballot",  (accounts) => {

    before( async ()=>{
        this.ballot = await Ballot.new([
            web3.utils.utf8ToHex("hockey"),
            web3.utils.utf8ToHex("badminton"),
            web3.utils.utf8ToHex("baseball"),
            web3.utils.utf8ToHex("basketball"),
            web3.utils.utf8ToHex("football")
        ], {from:accounts[0]});
        // console.log("this.ballot.address = ", this.ballot.address);
        // console.log("ballot.address = ", this.ballot.address);
        // const proposal0 = await this.ballot.proposals.call(0);
        // console.log('proposal0 = ', proposal0);
        // console.log("ballot.proposals = [", web3.utils.hexToNumberString(proposal0[1]), ", ", web3.utils.hexToUtf8(proposal0[0]), "]");
        // const proposal1 = await this.ballot.proposals.call(1);
        // console.log('proposal1 = ', proposal1);
        // console.log("ballot.proposals = [", web3.utils.hexToNumberString(proposal1[1]), ", ", web3.utils.hexToUtf8(proposal1[0]), "]");
        this.chairperson = accounts[0];
    });
    
    
    describe('giveRightToVote',  () => {
        it('giveRightToVote to accounts 1, 2, 3', async () => {
            await this.ballot.giveRightToVote(accounts[1], {from: this.chairperson});
            await this.ballot.giveRightToVote(accounts[2], {from: this.chairperson});
            await this.ballot.giveRightToVote(accounts[3], {from: this.chairperson});
            const voter1 = await this.ballot.voters.call(accounts[1]);
            const voter2 = await this.ballot.voters.call(accounts[2]);
            const voter3 = await this.ballot.voters.call(accounts[3]);
            assert.equal(voter1[0].toString(), '1', "account1 does NOT have vote weight '1'!");
            assert.equal(voter2[0].toString(), '1', "account2 does NOT have vote weight '1'!");
            assert.equal(voter3[0].toString(), '1', "account3 does NOT have vote weight '1'!");
        });
        it('giveRightToVote should be reverted', async () => {
            await expectRevert(this.ballot.giveRightToVote(accounts[4], {from: accounts[4]}), "Only chairperson can give right to vote.");
            await expectRevert(this.ballot.giveRightToVote(accounts[3], {from: this.chairperson}), "Voter's weight is not zero");
        });
    });

    describe('delegate',  () => {
        it('delegate from accounts 1 to accounts 4', async () => {
            await this.ballot.delegate(accounts[4], {from: accounts[1]});
            const voter1 = await this.ballot.voters.call(accounts[1]);
            const voter4 = await this.ballot.voters.call(accounts[4]);
            assert.equal(voter1['weight'].toString(), '1', "account1 should have vote weight '1'!");
            assert.equal(voter1['voted'], true, "account1 should have voted as true!")
            assert.equal(voter1['delegate'], accounts[4], "account1 should have 'delegate' as account 4!");
            assert.equal(voter4['weight'].toString(), '1', "account4 should have vote weight '1'!");
            assert.equal(voter4['voted'], false, "account4 should have voted as false!")
            assert.equal(voter4['delegate'], constants.ZERO_ADDRESS, "account4 should have 'delegate' as zero address!");
        });
        it('delegate from accounts 4 to accounts 4 should be reverted', async () => {
            await expectRevert(this.ballot.delegate(accounts[4], {from: accounts[4]}), 'Self-delegation is disallowed.');
        });
        it('delegate from accounts 4 to accounts 5 should be successful', async () => {
            await this.ballot.delegate(accounts[5], {from: accounts[4]});
            const voter5 = await this.ballot.voters.call(accounts[5]);
            assert.equal(voter5['weight'].toString(), '1', "account5 should have vote weight '1'!");
            assert.equal(voter5['voted'], false, "account5 should have voted as false!");
            assert.equal(voter5['delegate'], constants.ZERO_ADDRESS, "account5 should have 'delegate' as zero address!");
        });
        it('delegate from accounts 5 to accounts 4 should be reverted', async () => {
            await expectRevert(this.ballot.delegate(accounts[4], {from: accounts[5]}), 'Found loop in delegation.');            
        });
    });

    describe('vote from account 2, 3, 5',  () => {
        it('vote from account 2 (to 1), 3 (to 1), 5 (to 2) ', async () => {
            await this.ballot.vote(1, {from: accounts[2]});
            await this.ballot.vote(1, {from: accounts[3]});
            await this.ballot.vote(2, {from: accounts[5]});
            const voter2 = await this.ballot.voters.call(accounts[2]);
            const voter3 = await this.ballot.voters.call(accounts[3]);
            const voter5 = await this.ballot.voters.call(accounts[5]);
            assert.equal(voter2['voted'], true, "account2 should have voted as true!");
            assert.equal(voter2['delegate'], constants.ZERO_ADDRESS, "account2 should have 'delegate' as zero address!");
            assert.equal(voter2['vote'].toString(), '1', "account2 should have voted to 1!")


            assert.equal(voter3['voted'], true, "account3 should have voted as true!");
            assert.equal(voter3['delegate'], constants.ZERO_ADDRESS, "account3 should have 'delegate' as zero address!");
            assert.equal(voter3['vote'].toString(), '1', "account3 should have voted to 1!")

            assert.equal(voter5['voted'], true, "account5 should have voted as true!");
            assert.equal(voter5['delegate'], constants.ZERO_ADDRESS, "account5 should have 'delegate' as zero address!");
            assert.equal(voter5['vote'].toString(), '2', "account5 should have voted to 2!")
            
        });
        it('vote from account 6 (to 4) should be reverted', async () => {
            await expectRevert(this.ballot.vote(4, {from: accounts[6]}), 'Has no right to vote');
        });
        it('vote from account 5 (to 4) should be reverted', async () => {
            await expectRevert(this.ballot.vote(4, {from: accounts[5]}), 'Already voted.');
        });
    });

    describe('winning info', ()=>{
        it('winningProposal', async () => {
            const winningProposal_ = await this.ballot.winningProposal.call();
            assert.equal(winningProposal_.toString(), '1', "winningProposal() should be '1'!")
        });
        it('winnerName', async () => {
            const winnerName_ = await this.ballot.winnerName.call();
            assert.equal(web3.utils.hexToUtf8(winnerName_), 'badminton', "winnerName() should be 'badminton'!")
        });
    });

    
})