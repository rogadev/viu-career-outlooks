import NodeCache from 'node-cache'
const ttl = 60 * 60 * 24 * 30 * 2 // 2 month time to live
const cache = new NodeCache({ stdTTL: ttl })

export default cache
