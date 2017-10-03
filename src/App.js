import React, { Component } from 'react'
import { filter } from 'fuzzaldrin'
import electron from 'electron'
import Input from './components/Input'
import Repositories from './components/Repositories'
const constants = require('./constants')
const opn = electron.remote.require('opn')

class App extends Component {
  state = {
    currentRepositoryIndex: null,
    currentInputValue: "",
    visibleRepositories: [],
    repositories: [],
  }
  componentDidMount() {
    const repos = electron.remote.getGlobal('repos')
    this.setState({repositories: repos})

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        window.close()
      } else if (event.key === 'ArrowDown' && this.state.visibleRepositories.length > 1) {
        const currentRepositoryIndex = this.state.currentRepositoryIndex
        if (currentRepositoryIndex < this.state.visibleRepositories.length - 1) {
          this.setState({currentRepositoryIndex: currentRepositoryIndex + 1})
        }
      } else if (event.key === 'ArrowUp' && this.state.visibleRepositories.length > 1) {
        const currentRepositoryIndex = this.state.currentRepositoryIndex
        if (currentRepositoryIndex > 0) {
          this.setState({currentRepositoryIndex: currentRepositoryIndex - 1})
        }
      }
    }, true)
  }
  render() {

    const { visibleRepositories, currentRepositoryIndex, repositories, currentInputValue } = this.state

    return (
      <div className="App">
        <Input value={currentInputValue} onChangeHandler={this.onJumpInputChanged} onSubmitHandler={this.onJumpSubmitted} />
        <Repositories data={visibleRepositories} selectedIndex={currentRepositoryIndex} />
      </div>
    )
  }
  onJumpInputChanged = (event) => {
    const value = event.target.value
    this.setState({currentInputValue: value})
    this.filterRepositories(value)
  }
  onJumpSubmitted = (event) => {
    event.preventDefault()
    const { currentRepositoryIndex, visibleRepositories } = this.state
    if (currentRepositoryIndex === null) {
      return
    }
    const currentRepository = visibleRepositories[currentRepositoryIndex]
    console.log("Opening " + currentRepository.full_name)
    opn(currentRepository.html_url)
    electron.remote.getCurrentWindow().close()
  }
  filterRepositories = (filterString) => {
    let visibleRepositories = []

    if (filterString) {
      visibleRepositories = filter(this.state.repositories, filterString, {key: 'name', maxResults: 5})
      if (visibleRepositories) {
        this.setState({currentRepositoryIndex: 0})
      } else {
        this.setState({currentRepositoryIndex: null})
      }
    }

    if (visibleRepositories.length > 0) {
      electron.remote.getCurrentWindow().setSize(constants.DEFAULT_WINDOW_WIDTH, constants.EXPANDED_WINDOW_HEIGHT)
    } else {
      electron.remote.getCurrentWindow().setSize(constants.DEFAULT_WINDOW_WIDTH, constants.DEFAULT_WINDOW_HEIGHT)
    }

    if (visibleRepositories.length > 5) {
      visibleRepositories = visibleRepositories.slice(0, 5)
    }

    this.setState({visibleRepositories: visibleRepositories})
  }
}

export default App
