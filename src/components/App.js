import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Meme from '../abis/meme.json';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host:'ipfs.infura.io', port: 5001,  protocol:'https'})

class App extends Component {

  async componentWillMount () {
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadBlockChainData () {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    const networkData =  Meme.networks[networkId]

    if (networkData) {
      const abi = Meme.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({ contract })
      const memeHash =  await contract.methods.get().call()
      this.setState({ memeHash })

    } else {
      window.alert('smart contract not deployed to detected network')
    }

  }

  constructor(props){
    super(props);
    this.state = {
      buffer:null,
      memeHash:'',
      account: '',
      contract: null
    };
  }

  async loadWeb3 () {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Please use metamask')
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    console.log('file captured')

    //process FIle for IPFS
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result) })
    }

  }


  onSubmit = (event) => {
    event.preventDefault()
    console.log('submitting file..')
    ipfs.add(this.state.buffer, (error, result) => {
      //console.log('ipfs result',result)
      const memeHash = result[0].hash
      
      if (error) {
        console.error()
        return
      }
      this.state.contract.methods.set(memeHash).send({from: this.state.account }).then((r) => {
        this.setState({ memeHash })
      })
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meme of the Day
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={'https://ipfs.infura.io/ipfs/${this.state.memeHash}'} />
                </a>
                <p>&nbsp;</p>
                <h2>change meme </h2>
                <form onSubmit = {this.onSubmit} >
                    <input type="file" onChange={this.captureFile} />
                    <input type="submit" />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
