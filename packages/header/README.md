# Template - ModuleFederation e NGINX

Esse template abstrai React no contexto do ModuleFederation com variáveis de ambiente docker e faz o 
proxy reverso dessa aplicação usando NGINX.

## Variáveis de ambiente

No contexto de desenvolvimento, na sua máquina, é o procedimento padrão. Basta modificar o `environment.ts`.

Para as variáveis funcionarem no contexto da pipeline você precisa de 2 passos:

* Adicionar as variáveis nos arquivos do HelmChart da pasta `Config`;
* Adicionar as variáveis no arquivo `env.template.js`.

### Variáveis no HelmChart

Cada arquivo da pasta `Config` está relacionado a um determinado ambiente no contexto da pipeline e neles existe o atributo `env`.

Basta adicionar os valores das suas variáveis nesse atributo.

Suponha que temos duas variáveis: `PICLES` e `GINCOBILOBA`.

A configuração do arquivo ficaria assim:

```
env:
  enabled: true
  values:
    PICLES: "Aqui vai o valor da variável PICLES"
    GINCOBILOBA: "Aqui vai o valor da variável GINCOBILOBA"
```

### Variáveis no env.template.js

Esse arquivo é responsável por injetar as variáveis na nossa aplicação e o conteúdo default é esse:

```
(function setEnvironment(env){
  env.MY_VAR = '${MY_VAR}';
})(window['LOCALIZA_ENV'] || (window['LOCALIZA_ENV'] = {}));
```

Para utilizar nossas variáveis `PICLES` e `GINCOBILOBA` precisamos modificar os valores desse arquivo:

```
(function setEnvironment(env){
  env.PICLES = '${PICLES}';
  env.GINCOBILOBA = '${GINCOBILOBA}';
})(window['LOCALIZA_ENV'] || (window['LOCALIZA_ENV'] = {}));
```

Basta seguir o padrão `env.NOME_DA_VARIAVEL = '${NOME_DA_VARIAVEL}';` para qualquer variável.

É isso!

## Configuração ModuleFederation

No arquivo webpack.config.js você irá adicionar a configuração dos módulos que irá expor e consumir.

Para consumir os módulos com host dinâmico é necessário utilizar a lib privada `labs-mfe-utils`.

Temos um exemplo de uso no nosso arquivo do webpack:

```
remotes: {
  app2: handleWebpackMode({
    mode: args.mode,
    production: mfeDynamicRemoteHost({
      appName: 'app2',
      remoteHostVariable: 'APP2_REMOTE_URL',
    }),
    development: 'app2@http://localhost:3003/remoteEntry.js',
  }),
},
```

A função `handleWebpackMode` apenas nos auxilia para que nossa experiência de desenvolvimento seja fluida.

Basta adicionar uma chave com o nome do respectivo ambiente com o valor desejado.

No caso do exemplo no ambiente `development` deve ser usado um host remoto fixo
`app2@http://localhost:3003/remoteEntry.js`. Já no ambiente de produção será usado um host dinâmico com a função
`mfeDynamicRemoteHost`.

Para utilizar a `mfeDynamicRemoteHost`, você precisa definir qual no nome da aplicação que você está consumindo, no
nosso caso a `app2` e identificar qual o nome da variável que guarda o valor do host. Nesse caso o nome da variável
é `APP2_REMOTE_URL`.

Pra isso funcionar é necessário configurar a variável `APP2_REMOTE_URL` confirme foi explicado no tópico que versa 
sobre Variáveis de ambiente.
