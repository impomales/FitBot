const axios = require('axios')
const {
  buildFoodQuery,
  buildFoodQueryResult
} = require('../../../fitBotLambda/intentHandlers/handleQueryFood')

module.exports = function(agent) {
  let {
    food,
    servingType,
    servingWeight,
    servingVolume,
    quantity,
    indefiniteArticle
  } = agent.parameters

  let servingUnit = servingType || servingWeight.unit || servingVolume.unit
  let servingQuantity =
    indefiniteArticle ||
    servingWeight.amount ||
    servingVolume.amount ||
    quantity
  // if all required slots are fulfilled
  if (food && servingQuantity) {
    return axios
      .post(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        {
          query: buildFoodQuery(food, Number(servingQuantity), servingUnit)
        },
        {
          headers: {
            'x-app-id': process.env.NUTRITION_API_ID,
            'x-app-key': process.env.NUTRITION_API_KEY,
            'x-remote-user-id': 0
          }
        }
      )
      .then(res => res.data)
      .then(nutritionInfo => {
        const message = `${buildFoodQueryResult(
          nutritionInfo,
          servingUnit
        )} Would you like to log this item?`
        agent.add(message)
      })
      .catch(err => {
        const message = `${err.response.data.message} Please try again.`
        agent.add(message)
      })
  }
}
