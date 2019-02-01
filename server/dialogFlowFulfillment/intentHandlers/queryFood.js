const {
  getServingQuantity,
  getServingUnit,
  getNutritionInfo
} = require('../helpers')

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
    return getNutritionInfo(name, servingQuantity, servingUnit, agent)
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
    return getNutritionInfo(name, servingQuantity, servingUnit, agent)
  } else {
    agent.add(
      `I'm sorry I don't understand. please enter a serving size again.`
    )
  }
}

module.exports = {queryFood, queryFoodServingSize}
