import { initBotId } from 'botid/client/core'

initBotId({
  protect: [{ path: '/api/quote', method: 'POST' }],
})
