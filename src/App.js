import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import opn from 'opn'
import electron from 'electron'
import Input from 'components/Input'
import Repositories from 'components/Repositories'
const constants = require('./constants')

class App extends Component {
  state = {
    currentRepository: null,
    currentInputValue: "",
    visibleRepositories: [],
  }
  render() {

    const { visibleRepositories, currentRepository, currentInputValue } = this.state
    const { data } = this.props

    // if (!data.loading && data.viewer) {
    //   const repositories = this.getRepositories()
    // }

    return (
      <div className="App">
        <Input value={currentInputValue} onChangeHandler={this.onJumpInputChanged} onSubmitHandler={this.onJumpSubmitted} currentRepository={currentRepository} />
        <Repositories data={visibleRepositories} />
      </div>
    )
  }
  getRepositories = () => {
    return this.props.data.viewer.repositories.edges.map(edge => edge.node)
  }
  onJumpInputChanged = (event) => {
    const value = event.target.value
    this.setState({currentInputValue: value})
    console.log("Searching for: " + value)
    this.filterRepositories(value)
  }
  onJumpSubmitted = (event) => {
    event.preventDefault()
    console.log("Opening " + this.state.currentRepository.nameWithOwner)
    opn(this.state.currentRepository.htmlUrl)
    electron.remote.getCurrentWindow().close()
  }
  filterRepositories = (filter) => {
    let visibleRepositories = []
    let mostLikely = null

    if (filter) {
      visibleRepositories = this.getRepositories().filter(el => el.nameWithOwner.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
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

const UserRepositoriesQuery = gql`
  query UserRepositories($cursor: String) {
    viewer {
      repositories(first: 100, after: $cursor) {
        edges {
          node {
            id
            nameWithOwner
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`

export default graphql(UserRepositoriesQuery, {
  // This function re-runs every time `data` changes, including after `updateQuery`,
  // meaning our loadMoreEntries function will always have the right cursor
  props(data) {
    const { loading, viewer, fetchMore } = data
    console.log(data)
    if (!loading && viewer && viewer.repositories.pageInfo.hasNextPage) {
      fetchMore({
        query: UserRepositoriesQuery,
        variables: {
          cursor: viewer.repositories.pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.viewer.repositories.edges;
          const pageInfo = fetchMoreResult.viewer.repositories.pageInfo;
          return {
            // Put the new comments at the end of the list and update `pageInfo`
            // so we have the new `endCursor` and `hasNextPage` values
            viewer: {
              repositories: {
                edges: [...previousResult.viewer.repositories.edges, ...newEdges],
                pageInfo,
              }
            }
          }
        },
      })
    }

    return data
  },
})(App)
