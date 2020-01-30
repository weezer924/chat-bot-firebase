import React, { Component } from 'react'
import axios from 'axios'

class InputComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInput: ''
    }
  }

  handleInputChange = e => {
    this.setState({ userInput: e.target.value})
  }

  handleSubmit = e => {
    e.preventDefault();

    const {userInput} = this.state
    const requestTime = new Date()
    const intput = { 
      userInput,
      requestTime
    }

    axios.post('/chat', intput ).then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.error(err);
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder="※テキストフィールド" name="userInput" onChange={this.handleInputChange}></input>
        <input type="submit" placeholder="送信" />
      </form>
    )
  }
}

export default InputComponent