import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  padding: .5rem;
`
const FormInput = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 28px;
  &:focus {
    outline: none;
    border: 1px solid #ddd;
  }
`

class Input extends Component {
  componentDidMount() {
    this.inputRef.focus()
  }
  render() {
    const { value, full_name, onChangeHandler, onSubmitHandler } = this.props

    return (
        <Container>
          <form onSubmit={onSubmitHandler}>
            <FormInput
              onChange={onChangeHandler}
              value={value}
              ref={(input) => { this.inputRef = input }}
              type="text"
              placeholder="jump to a repo"
              onKeyDown={(event) => {
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                  event.preventDefault()
                }
              }}
            />
          </form>
        </Container>
    )
  }
}

export default Input
