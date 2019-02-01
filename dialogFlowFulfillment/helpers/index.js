function getServingUnit(params) {
  return params.reduce((curr, next) => curr || next, false)
}

function getServingQuantity(params) {
  return Number(params.reduce((curr, next) => curr || next, false))
}

module.exports = {
  getServingQuantity,
  getServingUnit
}
