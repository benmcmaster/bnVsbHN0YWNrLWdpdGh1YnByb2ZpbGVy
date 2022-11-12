import Nullstack from 'nullstack'
import { Button } from './shared/Button'
import H2 from './shared/H2'
import { Input } from './shared/Input'
import { ApplicationClientContext } from './types/ApplicationClientContext'
import { ApplicationServerContext } from './types/ApplicationServerContext'

interface HomeProps {}

interface GitHubUserData {
  name: string
  login: string
  picture: string
  stars: number
  languages: string[]
  repos: []
}

interface GetUserProps {
  username: string
}

export class Home extends Nullstack<HomeProps> {
  search = ''
  user: GitHubUserData

  static async getUser(context: GetUserProps) {
    const { gitHub, username } = context as ApplicationServerContext<GetUserProps>

    const userData = await gitHub.getUser(username)
    const userRepoData = await gitHub.getUserRepos(username)

    // Build an object to count the occurrences of a language in userRepoData[].
    let languagesCount = {};
    for (const element of userRepoData) {
      // filter out language = null
      if (element.language) {
        if (languagesCount[element.language]) {
          languagesCount[element.language] += 1;
        } else {
          languagesCount[element.language] = 1;
        }
      }
    }

    // Build and sort an array from the languagesCount object.
    let sortedLanguages = [];
    for (const element in languagesCount) {
      sortedLanguages.push([element, languagesCount[element]]);
    }
    sortedLanguages.sort((a, b) => b[1] - a[1]);

    // Build and sort an array of repo name and star count.
    let repos = userRepoData.map((element) => [element.name, element.stargazers_count]);
    repos.sort((a, b) => b[1] - a[1]);

    return {
      name: userData.name,
      login: userData.login,
      picture: userData.avatar_url,
      stars: userRepoData.reduce((acc, repo) => acc + repo.stargazers_count, 0),
      languages: sortedLanguages.map((element) => element[0]),
      repos: repos,
    } as GitHubUserData
  }

  prepare({ project, page }: ApplicationClientContext<HomeProps>) {
    page.title = `${project.name}`
    page.description = `${project.name} was made with Nullstack`
  }

  async searchUser() {
    this.user = undefined
    this.user = await Home.getUser({ username: this.search })
  }

  render({ worker }: ApplicationClientContext) {
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
              <H2>List of repos</H2>
              <ul>
                {this.user.repos.map((repo) => (
                  <li>
                    <a href={"https://github.com/" + this.user.login + "/" + repo[0] + "/pulls"} target="_blank">{repo[0]} ({repo[1]} ⭐)</a>
                  </li>
                ))}
              </ul>
            </section>
          </section>
        )}
      </section>
    )
  }
}
