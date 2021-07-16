import React, { ReactElement } from 'react'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

const GlobalStyle = createGlobalStyle`
  ${reset}
  body {
    font-family: 'Arial', sans-serif;
    background: #e4e4e4;
    color: #333;
  }

  h1 {
    font-size: 24px;
    padding: 18px;
  }

  section {
    margin: 0 auto;
    max-width: 1024px;

    padding: 24px;
  }
`

import Header from './components/Header'
import { getEnv } from './environment'

const environment = getEnv()

function App(): ReactElement {
    return (
        <>
            <GlobalStyle/>

            <Header title={environment.TITLE}/>

            <div className="container">
                <section>
                    <h1>Minha aplicação com header</h1>
                </section>
            </div>
        </>
    )
}

export default App
