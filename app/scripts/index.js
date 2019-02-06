// Import the page's CSS. Webpack will know what to do with it.
import "../styles/app.css"

// Import libraries we need.
import { default as Web3} from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import voting_artifacts from '../../build/contracts/Voting.json'
// Voting is our usable abstraction, which we'll use through the code below.
var Voting = contract(voting_artifacts)

//Import toastr from notification
import toastr from 'toastr'

// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
var contractInstance = Voting.at('0xa4bb2f49cd11a6153e543d1dadf6881c825c98d2')

window.App = {
    start: function() {
      var self = this

      var app = new Vue({
        el: '#app',
        data: {
          titulo: 'Elecciones',
          message: 'Hello Vue!',
          candidatos: [
            {
              id: 0,
              name: 'Candidate 1',
              votes: 0,
              partido: 'partido politico 1',
              hash : 'hH43e45FF3c3bcC54'
            },
            {
              id: 1,
              name: 'Candidate 2',
              votes: 0,
              partido: 'partido politico 2',
              hash: 'Ivan'
            },
            {
              id: 2,
              name: 'Candidate 3',
              votes: 0,
              partido: 'partido politico 3',
              hash: 'Marta'
            },
            {
              id: 3,
              name: 'Candidate 4',
              votes: 0,
              partido: 'partido politico 4',
              hash: 'Ff3454A3bcC244H'
            },

            {
              id: 4,
              name: 'Candidate 5',
              votes: 0,
              partido: 'partido politico 5',
              hash: '56HfAcc234E43a'
            },
          ],
        },
        created: function(){
          console.log('App creada');
          this.runWeb3();
        },
        methods:{
          votar: function(candidate) {
            if (candidate == '1acH456Hf34FF') {
              this.voteForCandidate(this.candidatos[0].hash, 0)
            }else if (candidate == '2ah433F4c34CCaD23') {
              this.voteForCandidate(this.candidatos[1].hash, 1)
            }else if (candidate == '3aF3dc23C3hH21Ee') {
              this.voteForCandidate(this.candidatos[2].hash, 2)
            }else if (candidate == '4afA34C3Dd854H344eF') {
              this.voteForCandidate(this.candidatos[3].hash, 3)
            }else if (candidate == '4aA2e546HfcD24FFe3') {
              this.voteForCandidate(this.candidatos[4].hash, 4)
            }
          },
          runWeb3: function () {
            Voting.setProvider(web3.currentProvider)
            Voting.defaults({from: web3.eth.coinbase})

            web3.eth.getAccounts(function(err, accs) {
              if (err != null) {
                toastr.error("there was an error fetching your accoutns.")
                return
              }
              if (accs.length == 0) {
                toastr.warning("No accounts");
                return
              }
            })
            this.loadData();
          },
          refreshCandidate: function(candidateName, indice) {
            var totalVotesPromise = contractInstance.totalVotesFor.call(candidateName)
            totalVotesPromise.then(votes => this.asigDates(votes.toString(), indice))
          },
          voteForCandidate: async function(message, indice) {
            toastr.info('Enviando voto', 'Esperando pago...', 8000)
            var self = this
            var candidateName = message
            var address = web3.eth.coinbase
            var voted = await contractInstance.voteForCandidate(candidateName, {from: address})
            await this.refreshCandidate(candidateName, indice)
            toastr.success('votaste por '+this.candidatos[indice].name, 'Votó con exito', 2000)
          },
          asigDates: function (data, indice) {
            this.candidatos[indice].votes = data
          },
          loadData: function () {
            for (var i = 0; i < this.candidatos.length; i++) {
              let candidateName = this.candidatos[i].hash
              this.refreshCandidate(candidateName, i)
            }
          }
        }
      })

    },
}


window.addEventListener('load', function(){
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start()
})
