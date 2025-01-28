import NodeCache from 'node-cache'
const ttl = 60 * 60 * 2 // 2 hour time to live
const cache = new NodeCache({ stdTTL: ttl })

export default cache
