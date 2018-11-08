module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'LogiDataTable',
      externals: {
        react: 'React'
      }
    }
  }
}
