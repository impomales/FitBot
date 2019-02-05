const {
  buildFoodQuery,
  buildFoodQueryResult,
  getNutritionInfo
} = require('../fitBotLambda/intentHandlers/handleQueryFood')

module.exports = function queryFood(name, unit, quantity, indefinite) {
  quantity = indefinite && !quantity ? 1 : quantity
  return getNutritionInfo(
    buildFoodQuery(name, Number(quantity), unit),
    nutritionInfo => {
      const message = `${buildFoodQueryResult(
        nutritionInfo,
        unit
      )} Would you like to log this item?`
      const info = {
        calories: nutritionInfo.foods[0].nf_calories,
        weightInGrams: nutritionInfo.foods[0].serving_weight_grams,
        quantity
      }

      return {info, message}
    },
    err => {
      const message = `${err.response.data.message} Please try again.`
      return {message}
    }
  )
}
