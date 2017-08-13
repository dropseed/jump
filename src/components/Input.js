import React, { Component } from 'react'

class Input extends Component {
  render() {
    const { fullName, onChangeHandler, onSubmitHandler, currentRepository } = this.props

    return (
        <div style={{ width: "100%", padding: ".5rem" }}>
          <h1>{currentRepository ? currentRepository.fullName : "nothing"}</h1>
          <form onSubmit={onSubmitHandler}>
            <input onChange={onChangeHandler} type="text" placeholder="jump to a repo" style={{ width: "100%", padding: "1rem" }} />
          </form>
        </div>
    )
  }
}

export default Input
