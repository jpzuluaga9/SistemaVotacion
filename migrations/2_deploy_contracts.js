var Voting = artifacts.require("Voting");
module.exports = async function(deployer, network, accounts) {
  let votingInstanceFuture = Voting.new(['hH43e45FF3c3bcC54', 'Ivan', 'Marta', 'Ff3454A3bcC244H', '56HfAcc234E43a']);
  let votingInstance = await votingInstanceFuture;
  console.log(votingInstance);
};
