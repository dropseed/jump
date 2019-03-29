import GitHubApi from '@octokit/rest'
import { getUserSettings } from './utils'

export const loadUserRepos = (callback) => {
    const userSettings = getUserSettings()
    if (!userSettings) return

    const { config = {} } = userSettings
    const { github_access_token: token = '', githubEnterprise = {} } = config

    const apiParameters = {
      headers: {
        "user-agent": "jump" // GitHub is happy with a unique user agent
      },
    }

    const github = new GitHubApi(Object.assign(apiParameters, githubEnterprise))

    github.authenticate({
      type: "token",
      token,
    })

    global.repos = []
    github.repos.getAll({per_page: 100}, getRepos)

    function getRepos(err, res) {
      if (err) {
        throw new Error(err)
      }

      global.repos = global.repos.concat(res['data']);
      // remove everything we're not using for better performance
      global.repos = global.repos.map(r => {
        return {'id': r.id, 'name': r.name, 'full_name': r.full_name, 'html_url': r.html_url, 'avatar_url': r.avatar_url || r.owner.avatar_url}
      })

      if (github.hasNextPage(res)) {
        github.getNextPage(res, getRepos)
      } else {
        // temporary to not load window until all results loaded
        // neeed to send results as they come?
        callback()
      }
    }
}
