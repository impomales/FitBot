const {
  getServingQuantity,
  getServingUnit,
  getNutritionInfo
} = require('../helpers')

function queryFood(agent) {
  let {
    food,
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

  if (!food) agent.add('Please enter a food item.')
  else if (!servingQuantity) agent.add('Please enter a serving size.')

  // if all required slots are fulfilled
  if (food && servingQuantity) {
    return getNutritionInfo(food, servingQuantity, servingUnit, agent)
  }
}

function queryFoodServingSize(agent) {
  let {
    food,
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
  if (food && servingQuantity) {
    return getNutritionInfo(food, servingQuantity, servingUnit, agent)
  } else {
    agent.add(
      `I'm sorry I don't understand. please enter a serving size again.`
    )
  }
}

function queryFoodLogYes(agent) {
  console.log(agent.context.get('queryfood-followup'))
  // save food item to database here.
  agent.add(`Your entry has been logged. You now have 500 calories left today.`)
}

module.exports = {queryFood, queryFoodServingSize, queryFoodLogYes}
