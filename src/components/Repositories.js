import React, { Component } from 'react'
import Repository from 'components/Repository'

class Repositories extends Component {
  render() {
    const { data } = this.props
    const repositoryItems = data.map(el => <Repository key={el.id} {...el} />)

    return (
      <div>
        {repositoryItems}
      </div>
    )
  }
}

export default Repositories
