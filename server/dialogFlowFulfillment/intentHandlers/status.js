const {getCaloriesRemaining} = require('../helpers')

function status(agent) {
  let date = new Date()
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return getCaloriesRemaining(date, agent)
}

module.exports = {status}
