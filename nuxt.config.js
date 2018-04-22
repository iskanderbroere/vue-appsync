import {} from "dotenv/config"
import nodeExternals from "webpack-node-externals"
import webpack from "webpack"

export default {
  mode: "spa",
  head: {
    titleTemplate: "%s - BONAS",
    meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Karla:400,400i,700,700i|EB+Garamond:400,700"
      },
      {
        rel: "stylesheet",
        href: "https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css"
      }
    ]
  },
  modules: ["~/modules/aws.js"],
  render: {
    http2: { push: true }
  },
  css: ["bootstrap/dist/css/bootstrap-reboot.css"],
  plugins: ["~/plugins/vue-font-awesome", "~/plugins/mapbox"],
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        mapboxgl: "mapbox-gl"
      })
    ],
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
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    API_KEY: process.env.API_KEY
  }
}
