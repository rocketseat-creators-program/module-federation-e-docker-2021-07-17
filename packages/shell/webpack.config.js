const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack').container
  .ModuleFederationPlugin
const Dotenv = require('dotenv-webpack')
const dependencies = require('./package.json').dependencies

const envPaths = {
  production: path.resolve('./', `.env.production`),
  development: path.resolve('./', `.env.development`),
}

module.exports = (_, args) => {
  const envPath = envPaths[args.mode]

  require('dotenv').config({ path: envPath })

  return {
    mode: args.mode,

    output: {
      publicPath: 'auto',
    },

    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 3002,
      publicPath: '/',
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
          },
        },
        {
          test: /\.md$/,
          loader: 'raw-loader',
        },
        {
          test: /\.css$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ['file-loader'],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/',
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        /**
         * @name name
         * @type string
         * @description é o nome do módulo na federação
         */

        name: 'shell',

        /**
         * @name filename
         * @type string
         * @description é o arquivo que contem as definições do módulo para a federação.
         * Caso o módulo seja servido no endereço http://localhost:3002, então nós baixaremos as definições dele em
         * http://localhost:3002/remoteEntry.js
         */
        filename: 'remoteEntry.js',

        /**
         * @name remotes
         * @description É a lista dos módulos dos quais essa aplicação depende. É um objeto de chave/valor onde a chave
         * é o nome do módulo e o valor segue o seguinte padrão NOME_DO_MODULO@ENDEREÇO_DE_SUA_DEFINIÇÂO.
         * Exemplo: shared@http://localhost:3003/remoteEntry.js
         */
        remotes: {
          header: 'header@http://localhost:8081/remoteEntry.js'
        },

        /**
         * @name exposes
         * @description É o objeto de definição de quais módulos dessa aplicação serão expostos. As chaves do objeto
         * são o path do módulo para a federação e o valor é o path do módulo nessa aplicação.
         * Exemplo: './App':'./src/App'
         */
        exposes: {},

        /**
         * @name shared
         * @description são as dependências compartilhadas pelos módulos da federação, aqui você pode ter um array com
         * o nome de cada dependência compartilhada ou um objeto com a chave sendo o nome da dependência e o valor um
         * objeto de configuração que vai definir se esse módulo será um singleton, qual a versão suportada e etc
         */
        shared: {
          ...dependencies,
          'react-dom': {
            requiredVersion: dependencies['react-dom'],
            singleton: true,
          },
          react: {
            requiredVersion: dependencies['react'],
            singleton: true,
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        env: (args.mode === 'production') ? '<script src="env.js"></script>' : ''
      }),
      new Dotenv({
        safe: true,
        path: envPath,
      }),
    ],
  }
}
