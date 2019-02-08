const {getServingQuantity, getServingUnit} = require('../helpers')

const {
  buildFoodQuery,
  buildFoodQueryResult,
  getNutritionInfo
} = require('../../fitBotLambda/intentHandlers/handleQueryFood')

/**
 * fulfillment handler for dialog flow
 * @param {Object} agent dialog flow webhook client
 * @param {Object} parameters parameters used to fulfill intent
 */
function queryFood(agent) {
  let {
    name,
    servingType,
    servingWeight,
    servingVolume,
    servingWeightName,
    servingVolumeName,
    quantity,
    indefiniteArticle
  } = agent.parameters

  let servingUnit = getServingUnit([
    servingType,
    servingWeight.unit,
    servingVolume.unit,
    servingVolumeName,
    servingWeightName
  ])

  let servingQuantity = getServingQuantity([
    indefiniteArticle,
    servingWeight.amount,
    servingVolume.amount,
    quantity
  ])

  if (!name) agent.add('Please enter a food item.')
  else if (!servingQuantity) agent.add('Please enter a serving size.')

  // if all required slots are fulfilled
  if (name && servingQuantity) {
    return getNutritionInfo(
      buildFoodQuery(name, Number(servingQuantity), servingUnit),
      nutritionInfo => {
        const message = `${buildFoodQueryResult(
          nutritionInfo,
          servingUnit
        )} Would you like to log this item?`
        agent.add(message)
        agent.context.set('queryfood-followup', 1, {
          calories: nutritionInfo.foods[0].nf_calories,
          weightInGrams: nutritionInfo.foods[0].serving_weight_grams,
          quantity: servingQuantity,
          unit: servingUnit
        })
      },
      err => {
        const message = `${err.response.data.message}. Please try again.`
        agent.add(message)
      }
    )
  }
}

function queryFoodServingSize(agent) {
  let {
    name,
    servingType,
    servingWeight,
    servingVolume,
    servingWeightName,
    servingVolumeName,
    quantity,
    indefiniteArticle
  } = agent.context.get('queryfood-followup').parameters

  let servingUnit = getServingUnit([
    servingType,
    servingWeight.unit,
    servingVolume.unit,
    servingVolumeName,
    servingWeightName
  ])

  let servingQuantity = getServingQuantity([
    indefiniteArticle,
    servingWeight.amount,
    servingVolume.amount,
    quantity
  ])

  // if all required slots are fulfilled
  if (name && servingQuantity) {
    return getNutritionInfo(
      buildFoodQuery(name, Number(servingQuantity), servingUnit),
      nutritionInfo => {
        const message = `${buildFoodQueryResult(
          nutritionInfo,
          servingUnit
        )} Would you like to log this item?`
        agent.add(message)
        agent.context.set('queryfood-followup', 1, {
          calories: nutritionInfo.foods[0].nf_calories,
          weightInGrams: nutritionInfo.foods[0].serving_weight_grams,
          quantity,
          servingUnit
        })
      },
      err => {
        const message = `${err.response.data.message} Please try again.`
        agent.add(message)
      }
    )
  } else {
    agent.add(
      `I'm sorry I don't understand. please enter a serving size again.`
    )
  }
}

module.exports = {queryFood, queryFoodServingSize}
