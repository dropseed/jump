import React, { Component } from 'react'
import Repository from './Repository'

class Repositories extends Component {
  render() {
    const { data, selectedIndex } = this.props
    const repositoryItems = data.map((el, index) => <Repository key={el.id} {...el} selected={index ===  selectedIndex} />)

    return (
      <div>
        {repositoryItems}
      </div>
    )
  }
}

export default Repositories
