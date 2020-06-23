# ![icon](./icon.png) jump [pre-release]

A MacOS app built with [Electron](https://github.com/electron/electron) that gives you a global `Cmd+J` shortcut to open a repo jump-menu. The repo then opens in your browser.

[Download the latest release](https://github.com/dropseed/jump/releases/latest)

![jump preview](preview.gif)

## Configuration

You need a `~/.jump.json` config file that looks like this:

```json
{
  "config": {
    "github_access_token": "youraccesstokenhere",
    "globalShortcut": "Command+J",
    "githubEnterprise": {
      "host": "optional",
      "pathPrefix": "optional"
    }
  }
}
```

- `github_access_token` is required and should be a [personal access token that you create with the "repo" permission](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/#creating-a-token)
- `globalShortcut` is an optional [shortcut](https://electronjs.org/docs/api/global-shortcut) that you can provide to open jump (`CommandOrControl+J` by default)
- `githubEnterprise.host` and `githubEnterprise.pathPrefix` must be set when using Github Enterprise
