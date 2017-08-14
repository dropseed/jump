import React, { Component } from 'react'
import Fuse from 'fuse.js'
import electron from 'electron'
import Input from 'components/Input'
import Repositories from 'components/Repositories'
const constants = require('./constants')
const opn = electron.remote.require('opn')

class App extends Component {
  state = {
    currentRepository: null,
    currentInputValue: "",
    visibleRepositories: [],
    repositories: [],
  }
  componentDidMount() {
    const repos = electron.remote.getGlobal('repos')
    const fuse = new Fuse(repos, {
      keys: [
        "full_name"
      ]
    })
    this.setState({repositories: repos, fuse: fuse})
    console.log(repos)

    window.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        window.close()
      }
    }, true)
  }
  render() {

    const { visibleRepositories, currentRepository, repositories, currentInputValue } = this.state

    return (
      <div className="App">
        <Input value={currentInputValue} onChangeHandler={this.onJumpInputChanged} onSubmitHandler={this.onJumpSubmitted} currentRepository={currentRepository} />
        <Repositories data={visibleRepositories} />
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
    console.log("Opening " + this.state.currentRepository.full_name)
    opn(this.state.currentRepository.html_url)
    electron.remote.getCurrentWindow().close()
  }
  filterRepositories = (filter) => {
    let visibleRepositories = []
    let mostLikely = null

    if (filter) {
      visibleRepositories = this.state.fuse.search(filter)
      if (visibleRepositories) {
        mostLikely = visibleRepositories[0]
      }
    }

    if (visibleRepositories.length > 0) {
      electron.remote.getCurrentWindow().setSize(constants.DEFAULT_WINDOW_WIDTH, constants.EXPANDED_WINDOW_HEIGHT)
    } else {
      electron.remote.getCurrentWindow().setSize(constants.DEFAULT_WINDOW_WIDTH, constants.DEFAULT_WINDOW_HEIGHT)
    }

    if (visibleRepositories.length > 10) {
      visibleRepositories = visibleRepositories.slice(0, 10)
    }

    this.setState({visibleRepositories: visibleRepositories, currentRepository: mostLikely})
  }
}

export default App
