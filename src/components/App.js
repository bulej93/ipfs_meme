import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host:'ipfs.infura.io', port: 5001,  protocol:'https'})

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      buffer:null,
      memeHash:''
    };
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
      console.log('ipfs result',result)
      const memeHash = result[0].hash
      this.setState({ memeHash })
      if (error) {
        console.error()
        return
      }
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
