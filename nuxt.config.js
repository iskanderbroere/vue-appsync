import {} from "dotenv/config"
import nodeExternals from "webpack-node-externals"

export default {
  mode: "spa",
  head: {
    titleTemplate: "%s - Vue AWS Appsync",
    meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Karla:400,400i,700,700i|EB+Garamond:400,700"
      }
    ]
  },
  render: {
    http2: { push: true }
  },
  css: ["bootstrap/dist/css/bootstrap-reboot.css"],
  plugins: ["~/plugins/vue-font-awesome", "~/plugins/aws"],
  build: {
    extend(config, { isDev, isClient, isServer }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
      if (isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/es6-promise|\.(?!(?:js|json)$).{1,5}$/i, /^vue-awesome/]
          })
        ]
      }
    }
  },
  env: {
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
    API_KEY: process.env.API_KEY
  }
}
