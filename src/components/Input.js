import React, { Component } from 'react'

class Input extends Component {
  componentDidMount() {
    this.input.focus()
  }
  render() {
    const { fullName, onChangeHandler, onSubmitHandler, currentRepository } = this.props

    return (
        <div style={{ width: "100%", padding: ".5rem" }}>
          <form onSubmit={onSubmitHandler}>
            <input onChange={onChangeHandler} ref={(input) => { this.input = input }} type="text" placeholder="jump to a repo" style={{ width: "100%", padding: "1rem" }} />
          </form>
        </div>
    )
  }
}

export default Input
