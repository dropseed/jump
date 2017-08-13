import React, { Component } from 'react'
import styled from 'styled-components'
import Autocomplete from 'react-autocomplete'
import Repository from 'components/Repository'

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: .5rem;
  overflow: visible;
`
const FormInput = styled.input`
  width: 100%;
  padding: .5rem;
  font-size: 1.8rem;
  &:focus {
    outline: none;
    border: 1px solid #ddd;
  }
`

class Input extends Component {
  componentDidMount() {
    // if (this.input !== document.activeElement) this.input.focus()
    this.input.focus()
  }
  render() {
    const { repositories, value, fullName, onChangeHandler, onSubmitHandler, currentRepository } = this.props

    return (
        <Container>
          <form onSubmit={onSubmitHandler}>
            <Autocomplete
              onChange={onChangeHandler}
              value={value}
              ref={(input) => { this.input = input }}
              items={repositories}
              getItemValue={(repo) => repo.fullName}
              renderItem={(item, isHighlighted) =>
                <Repository {...item} isHighlighted={isHighlighted} />
              }
              // renderMenu={(items, value, style) =>
              //   <Repositories data={items} />
              // }
              inputProps={{style: { width: '100%'}}}
              menuStyle={{width: '100%'}}
              // open={true}
            />
          </form>
        </Container>
    )
  }
}

export default Input
