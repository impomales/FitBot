const router = require('express').Router()
const {FoodLog} = require('../db/models')
const {Op} = require('sequelize')
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

// can get food logs by user, and date
router.get('/', async (req, res, next) => {
  const {dateStr, userId} = req.query

  const date = new Date(dateStr)
  let nextDay = new Date(dateStr)
  nextDay.setDate(date.getDate() + 1)
  const createdAt = {
    [Op.gte]: date,
    [Op.lt]: nextDay
  }
  console.log(createdAt)
  try {
    const foodLogs = await FoodLog.findAll({
      where: {userId, createdAt}
    })
    res.status(200).json(foodLogs)
  } catch (err) {
    next(err)
  }
})
