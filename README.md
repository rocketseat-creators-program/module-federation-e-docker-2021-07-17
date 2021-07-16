# Hands On

Vamos configurar nosso projeto para que ele seja capaz de criar uma imagem docker e modificar variáveis de ambiente e hosts do ModuleFederation sem que seja necessário um novo build da aplicação.

## Variáveis de ambiente

Nosso projeto está resolvendo as variáveis de ambiente no momento do build e essa abordagem não é aderente à nossa estratégia.

Para resolver esse problema vamos criar o nosso arquivo com nossas variáveis, no momento que iniciarmos o container.

Primeiro vamos criar um template de variáveis: `env.template.js`

```
(function setEnvironment(env) {
})(window['APP_ENV'] || (window['APP_ENV'] = {}))
```

Nosso arquivo de template é um IIFE (Immediately Invoked Function Expression), ou seja, quando ele é carregado sua função é executada imediatamente e no nosso caso, adiciona as variáveis na chave `APP_ENV` do `window`.

Agora na verdade ele não está fazendo nada, mas vamos resolver isso:

```
(function setEnvironment(env) {
    env.TITLE = '${TITLE}';
})(window['APP_ENV'] || (window['APP_ENV'] = {}))
```

Como esse arquivo é um template precisamos de uma estratégia para mudar os valores conforme a nossa necessidade, por isso utilizamos a sintaxe `${TITLE}` no valor. 

Dessa forma podemos utilizar algo como o `envsubst` e modificar facilmente esse valor.

Agora precisamos de um script responsável por modificar esses valores. Vamos criar o `env.sh`.

```
#!/bin/bash
envsubst < env.template.js > /usr/share/nginx/html/env.js
```

Nosso script usa o `envsubst` para substituir os valores do `env.template.js` e cria um arquivo `env.js` na raiz do nosso web server.

Esse arquivo ainda não está sendo carregado no nosso projeto e por isso precisamos modificar nosso `webpack.config.js`
e nosso `public/index.html`.

### webpack.config.js:

```
module.exports = (_, args) => {
    ...
    plugins: [
      ...
      new HtmlWebpackPlugin({
        template: './public/index.html',
        env: (args.mode === 'production') ? '<script src="env.js"></script>' : ''
      }),
     ...
    ],
  }
}
```

### index.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
   ...
      <%= htmlWebpackPlugin.options.env %>
   ...
  </head>
  ...
</html>
```

Também precisamos mudar a lógica de consumo das variáveis de ambiente da nossa aplicação e faremos isso no arquivo `src/environment.ts`:

```
declare const process: any

function isBrowser(): boolean {
  try {
    return typeof window !== 'undefined'
  } catch (e) {
    return false
  }
}

const ENV = isBrowser() ? (window as any).APP_ENV : process.env // Solve variables using Docker

export interface Environment {
  TITLE: stirng;
}

export const getEnv = (env = process.env.APP_ENV): Environment => {
  switch (env) {
    case 'production':
      return {
        ...ENV,
      }
    default:
      return {
        TITLE: 'Minha aplicação'
      }
  }
}
```

Em tempo de build vamos apenas resolver em qual ambiente nós estamos. No nosso container sempre vai ser `production` e em desenvolvimento será `development`.

Vamos alterar nossos arquivos `.env.development` e `.env.production` para que isso seja possível:

### .env.development

```
APP_ENV=development
```

### .env.production

```
APP_ENV=production
```

Falta também configurar nosso `Dockerfile`:

```
FROM node:12.4.0-alpine as build
...

# production environment
FROM nginx:1.21.1 as base
...
COPY env.sh env.sh
COPY env.template.js env.template.js
...
```

Pronto! Agora podemos resolver nossas variáveis de ambiente de forma dinâmica.

## ModuleFederation Dynamic Host

O plugin do ModuleFederation permite que você configure uma string que representa uma promise nos valores da chave `remote`, dessa forma você pode ter hosts dinâmicos.

Disponibilizamos uma abstração dessa abordagem no arquivo `mfe-utils.js`.

Agora vamos atualizar o `webpack.config.js` para utilizarmos essa estratégia.

```
module.exports = (_, args) => {
    ...
    plugins: [
      ...
      new ModuleFederationPlugin({
        ...
        remotes:{
            header: handleWebpackMode({
                mode: args.mode,
                production: mfeDynamicRemoteHost({
                  appName: 'header',
                  remoteHostVariable: 'HEADER_HOST',
                }),
                development: 'header@http://localhost:8081/remoteEntry.js',
            })
        }
        ...
      })
     ...
    ],
  }
}
```

Como essa informação é dinâmica, precisamos inserir a variáveis do nosso host no nosso arquivo de template, `env.template.js`.

``` 
(function setEnvironment(env) {
    env.HEADER_HOST = '${HEADER_HOST}';
})(window['APP_ENV'] || (window['APP_ENV'] = {}))
```

Pronto! Agora você tem hosts remotos dinâmicos.

Muito obrigado!

Espero que tenham gostado.
