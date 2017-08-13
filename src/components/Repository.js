import React, { Component } from 'react'
import styled from 'styled-components'

class Repository extends Component {
  render() {
    const { fullName } = this.props

    const Container = styled.div`
      font-size: 1.25rem;
      padding: .75rem;
      font-weight: 200;
      border-bottom: 1px solid #e4e4e4;
    `

    return (
        <Container>
          {fullName}
        </Container>
    )
  }
}

export default Repository
