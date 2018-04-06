import {} from "dotenv/config"

export default {
  head: {
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    ]
  },
  modules: ["@nuxtjs/apollo"],
  apollo: {
    clientConfigs: {
      default: "~/apollo/clientconfigs/default.js"
    }
  },
  render: {
    http2: { push: true }
  },
  build: {
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
    }
  },
  env: {
    endpoint: process.env.GRAPHQL_ENDPOINT || "test"
  }
}
