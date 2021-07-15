import React, { ReactElement } from 'react'
import { Reset } from 'styled-reset'

import Header from './components/Header'
import { getEnv } from './environment'

const environment = getEnv()

function App(): ReactElement {
  return (
    <>
      <Reset />
      <Header title={environment.TITLE} />
    </>
  )
}

export default App
