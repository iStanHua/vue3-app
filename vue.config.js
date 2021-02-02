const path = require('path')

const resolve = (dir) => path.join(__dirname, dir)

const isProd = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  chainWebpack: (config) => {
    // config.optimization.minimizer([
    //   new TerserPlugin({
    //     terserOptions: {
    //       compress: {
    //         drop_console: true,
    //         drop_debugger: false,
    //         pure_funcs: ['console.log']
    //       }
    //     }
    //   })
    // ])

    if (isProd) {
      config.optimization.minimize(true)
      config.optimization.splitChunks({ chunks: 'all' })

      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true
        args[0].terserOptions.compress.drop_debugger = false
        args[0].terserOptions.compress.pure_funcs = ['console.log']
        return args
      })
    }

    // 修复HMR
    config.resolve.symlinks(true)

    config.plugin('html').tap(args => {
      args[0].chunksSortMode = 'none'
      return args
    })

  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/styles/variables.scss";'
      }
    }
  },

  devServer: {
    open: true,
    port: 2021,
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:8080',
    //   }
    // }
  }
}
