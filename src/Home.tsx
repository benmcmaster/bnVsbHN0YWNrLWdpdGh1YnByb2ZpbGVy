import Nullstack, { NullstackClientContext } from 'nullstack'
import { gitHub } from './services/github'
import { Button } from './shared/Button'
import H2 from './shared/H2'
import { Input } from './shared/Input'

interface HomeProps {}

interface GitHubUserData {
  name: string
  picture: string
  stars: number
  languages: string[]
}

export class Home extends Nullstack<HomeProps> {
  search = ''
  user: GitHubUserData

  static async getUser({ username }: { username: string }) {
    const userData = await gitHub.getUser(username)
    const userRepoData = await gitHub.getUserRepos(username)

    return {
      name: userData.name,
      picture: userData.avatar_url,
      stars: userRepoData.reduce((acc, repo) => acc + repo.stargazers_count, 0),
      languages: ['// TODO:', 'list', 'of', 'langs', 'here', 'most used', 'to', 'least used'],
    } as GitHubUserData
  }

  prepare({ project, page }: NullstackClientContext<HomeProps>) {
    page.title = `${project.name}`
    page.description = `${project.name} was made with Nullstack`
  }

  async searchUser() {
    this.user = undefined
    this.user = await Home.getUser({ username: this.search })
  }

  render({ worker }: NullstackClientContext) {
    const loading = !!worker.queues.getUser?.length

    return (
      <section class="w-full min-h-screen">
        <form onsubmit={this.searchUser} class="flex gap-2">
          <div class="flex-1">
            <Input bind={this.search} spellcheck="false" autofocus placeholder="GitHub username here..." />
          </div>

          <div>
            <Button type="submit" disabled={loading} class={loading ? 'animate-spin' : null}>
              {loading ? 'Loading' : 'Get'}
            </Button>
          </div>
        </form>

        {loading ? <div>Loading</div> : null}

        {this.user && (
          <section>
            <section class="flex gap-4 items-center justify-center py-8">
              <div>
                <img alt="" src={this.user.picture} width={450} height={450} />
              </div>

              <div class="flex flex-1">
                <div>
                  <H2>{this.user.name}</H2>

                  <div>{this.user.stars} ⭐</div>

                  <div class="py-4">
                    <ul>
                      {this.user.languages.map((lang) => (
                        <li>{lang}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              // TODO: List of repos
              <ul>
                <li>repos with most stars first (order by stars desc)</li>
                <li>on click open repos PRs by user</li>
              </ul>
            </section>
          </section>
        )}
      </section>
    )
  }
}
