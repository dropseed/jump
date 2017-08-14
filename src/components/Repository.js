import React, { Component } from 'react'
import styled from 'styled-components'

class Repository extends Component {
  render() {
    const { avatar_url, full_name, selected } = this.props

    const Container = styled.div`
      font-size: 20px;
      line-height: 20px;
      padding: 12px;
      font-weight: 200;
      background-color: ${props => props.selected ? "#e4e4e4" : "transparent"};
    `

    const Img = styled.img`
      width: 20px;
      height: 20px;
      float: left;
      margin-right: 10px;
      border-radius: 2px;
    `

    return (
      <Container selected={selected}>
        <Img src={avatar_url} />
        {full_name}
      </Container>
    )
  }
}

export default Repository
