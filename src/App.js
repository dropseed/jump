import React, { Component } from 'react'
import opn from 'opn'
import electron from 'electron'
import './App.css'
import Input from 'components/Input'
import Repositories from 'components/Repositories'
const constants = require('./constants')

class App extends Component {
  state = {
    currentRepository: null,
    visibleRepositories: [],
    repositories: [
      {
        "id": 1,
        "fullName": "dropseedlabs/jump",
        "htmlUrl": "https://github.com/dropseedlabs/jump"
      },
      {
        "id": 2,
        "fullName": "flinthillsdesign/FlintHillsDesignWP",
        "htmlUrl": "https://github.com/flinthillsdesign/FlintHillsDesignWP"
      }
    ]
  }
  render() {

    const { visibleRepositories, currentRepository, repositories } = this.state

    return (
      <div className="App">
        <Input onChangeHandler={this.onJumpInputChanged} onSubmitHandler={this.onJumpSubmitted} currentRepository={currentRepository} />
        <Repositories data={visibleRepositories} />
      </div>
    )
  }
  onJumpInputChanged = (event) => {
    const value = event.target.value
    console.log("Searching for: " + value)
    this.filterRepositories(value)
  }
  onJumpSubmitted = (event) => {
    event.preventDefault()
    console.log("Opening " + this.state.currentRepository.fullName)
    opn(this.state.currentRepository.htmlUrl)
    electron.remote.getCurrentWindow().close()
  }
  filterRepositories = (filter) => {
    let visibleRepositories = []
    let mostLikely = null

    if (filter) {
      visibleRepositories = this.state.repositories.filter(el => el.fullName.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
      if (visibleRepositories) {
        mostLikely = visibleRepositories[0]
      }
    }

    if (visibleRepositories.length > 0) {
      electron.remote.getCurrentWindow().setSize(constants.DEFAULT_WINDOW_WIDTH, constants.EXPANDED_WINDOW_HEIGHT)
    } else {
      electron.remote.getCurrentWindow().setSize(constants.DEFAULT_WINDOW_WIDTH, constants.DEFAULT_WINDOW_HEIGHT)
    }

    this.setState({visibleRepositories: visibleRepositories, currentRepository: mostLikely})
  }
}

export default App
