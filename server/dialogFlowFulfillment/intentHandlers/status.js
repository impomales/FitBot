const {getFoodLogs} = require('../helpers')

function status(agent) {
  let date = new Date()
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return getFoodLogs(date, agent)
}

module.exports = {status}
