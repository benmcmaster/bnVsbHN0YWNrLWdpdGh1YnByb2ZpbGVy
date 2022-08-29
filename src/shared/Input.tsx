import Nullstack from 'nullstack'

const darkMode = 'dark:bg-slate-800 dark:highlight-white/5 dark:hover:bg-slate-700'
const lightMode = 'hover:ring-slate-300'
const general =
  'w-full lg:flex items-center py-1.5 pl-2 pr-3 text-sm shadow-sm leading-6 rounded-md ring-1 ring-slate-900/10 text-slate-400'

export class Input extends Nullstack {
  render(props) {
    return <input {...props} class={`${general} ${lightMode} ${darkMode}`} />
  }
}
