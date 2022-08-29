import Nullstack from 'nullstack'

const darkMode = 'dark:shadow-highlight/20'
const general =
  'relative flex-none rounded-md text-sm font-semibold leading-6 py-1.5 px-3 hover:bg-sky-400 bg-sky-500 text-white shadow-sm'

export class Button extends Nullstack {
  render(props) {
    return (
      <button {...props} class={`${general} ${darkMode} ${props.class ?? ''}`}>
        {props.children}
      </button>
    )
  }
}
