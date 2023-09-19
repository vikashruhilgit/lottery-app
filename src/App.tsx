import Welcome from './components/welcome/welcome'
import Register from './components/register/register'
import Winner from './components/winner/winner'

import styles from './App.module.scss'

function App() {

  return (
    <section className={styles.wrapper}>
      <Welcome />
      <Register />
      <Winner />
    </section>
  )
}

export default App