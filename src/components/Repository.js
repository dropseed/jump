import React, { Component } from 'react'

class Repository extends Component {
  render() {
    const { fullName } = this.props

    return (
        <div>
          {fullName}
        </div>
    )
  }
}

export default Repository
