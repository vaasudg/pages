import mongoose from 'mongoose'
import { config } from './config'
import { Logs } from './utils/constants'
const { log } = new Logs('setup DB')

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.MONGODB_URI}`)
      .then(() => {
        log().info({
          message: 'DB connected successfully'
        })
      })
      .catch(error => {
        log().info({
          message: 'DB connected successfully',
          error
        })
        return process.exit(1)
      })
  }

  connect()

  mongoose.connection.on('disconnected', connect)
}
