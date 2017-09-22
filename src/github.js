import GitHubApi from 'github'
import { getUserSettings } from './utils'

export const loadUserRepos = (callback) => {
    const github = new GitHubApi({
      headers: {
        "user-agent": "jump" // GitHub is happy with a unique user agent
      },
    })

    github.authenticate({
      type: "token",
      token: getUserSettings().config.github_access_token,
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
