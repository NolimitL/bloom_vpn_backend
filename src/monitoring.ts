import * as swStats from 'swagger-stats'

export function createMonitoringMiddleware() {
  const { MONITORING_USERNAME, MONITORING_PASSWORD } = process.env
  const isAuthRequired = !!(MONITORING_USERNAME || MONITORING_PASSWORD)

  return swStats.getMiddleware({
    name: 'TheBloom server',
    uriPath: '/api/stats',
    authentication: isAuthRequired,
    onAuthenticate(req, username, password) {
      return (
        username === MONITORING_USERNAME && password === MONITORING_PASSWORD
      )
    },
  })
}
