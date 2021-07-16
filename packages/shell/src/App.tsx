import React, { ReactElement } from 'react';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

import Header from 'header/Header';

const GlobalStyle = createGlobalStyle`
  ${reset}

  body{
    font-family: 'Arial', sans-serif;
    background: linear-gradient(270deg,#0a0906,#121214);
    color: #fff;
  }

  h1{
    font-size: 24px;
    padding: 18px;
    color: #db3a2c;
  }

  section {
    margin: 0 auto;
    max-width: 1024px;

    padding: 24px;
  }
`

function App(): ReactElement {
    return (
        <>
            <GlobalStyle/>
            <Header title={'Shell'}/>
            <section>
                <h1>Minha aplicação Shell</h1>
            </section>
        </>
    )
}

export default App
