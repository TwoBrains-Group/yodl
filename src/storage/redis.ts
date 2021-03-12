import redis from 'redis'
import {promisifyAll} from './utils'

promisifyAll(redis.RedisClient)

class Redis {

}
