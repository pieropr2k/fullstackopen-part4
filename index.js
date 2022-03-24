const app = require('./app.js')
const http = require('http')
const logger = require('./utils/logger.js')
const { PORT } = require('./utils/config.js')

const server = http.createServer(app)

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})