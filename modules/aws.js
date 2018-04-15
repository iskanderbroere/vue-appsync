const path = require("path")

module.exports = function nuxtApollo() {
  this.addPlugin({
    src: path.join(__dirname, "plugin.js")
  })
  this.extendBuild(config => {
    config.resolve.extensions = config.resolve.extensions.concat(".graphql", ".gql")
    const gqlRules = {
      test: /\.(graphql|gql)$/,
      use: "graphql-tag/loader",
      exclude: /(node_modules)/
    }
    config.module.rules.push(gqlRules)
  })
}
