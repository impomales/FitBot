const router = require('express').Router()
const {FoodLog} = require('../db/models')
module.exports = router

router.post('/', async (req, res, next) => {
  const {
    name,
    unit,
    quantity,
    weightInGrams,
    calories,
    mealTime
  } = req.body.foodLog

  try {
    const foodLog = await FoodLog.create({
      name,
      unit,
      quantity,
      weightInGrams,
      calories,
      mealTime
    })

    let userId = Number(req.body.id)
    if (userId) await foodLog.setUser(Number(req.body.id))

    res.status(201).json(foodLog)
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const foodLogs = await FoodLog.findAll()
    res.status(200).json(foodLogs)
  } catch (err) {
    next(err)
  }
})
