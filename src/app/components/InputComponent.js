import React, { Component } from 'react'
import axios from 'axios'

class InputComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInput: '',
      inputResult: []
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
      this.setState({inputResult: this.state.inputResult.concat([res.data])})
    })
    .catch(err => {
      console.error(err);
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="※テキストフィールド" name="userInput" onChange={this.handleInputChange}></input>
          <input type="submit" placeholder="送信" />
        </form>
        <div>
          {this.state.inputResult.map((data, idx) => {
            return <p key={idx}>
              {data.request_timestamp} You > {data.user_input} <br></br>
              {data.response_timestamp} Bot > {data.bot_response}
            </p>
          })}
        </div>
      </div>
    )
  }
}

export default InputComponent