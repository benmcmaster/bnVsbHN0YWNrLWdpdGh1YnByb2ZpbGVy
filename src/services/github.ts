class GitHubService {
  static bindStaticFunctions() {}

  async getUser(username: string) {
    const response = await fetch(`https://api.github.com/users/${username}`)
    const data = await response.json()

    return data
  }

  async getUserRepos(username: string) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`)
    const data = await response.json()

    return data
  }
}

export const gitHub = new GitHubService()
