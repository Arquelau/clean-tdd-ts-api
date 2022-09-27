module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '4.0.7',
      skipMD5: true
    },
    autoStart: false
  }
}
