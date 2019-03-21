/* eslint-disable max-statements */
/* eslint-disable complexity */
const aws = require('aws-sdk')
const randomstring = require('randomstring')
const caloriesRemaining = require('./caloriesRemaining')
const saveFoodLog = require('./saveFoodLog')
const {ExerciseLog, Workout} = require('../db/models')

/**
 * initiates the lex service
 * @function
 * @param {Object} user currently logged in user
 * @param {String} user.id user id
 * @returns {String} session id
 */
function initiateLex(user) {
  this.service = new aws.LexRuntime({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  return `${user.id}-${randomstring.generate()}`
}

/**
 * sends user input to Lex
 * @function
 * @param {String} sessionUserId id used to reference current session with user
 * @param {String} text input text user is sending
 * @param {Function} callback function that handles error, or sends response back to user
 */
function messageLex(sessionUserId, text, callback, user, sessionAttributes) {
  const {weightInKg, heightInCm, age, gender} = user
  this.service.postText(
    {
      botAlias: process.env.BOT_ALIAS,
      botName: process.env.BOT_NAME,
      userId: sessionUserId,
      inputText: text,
      sessionAttributes: {
        ...sessionAttributes,
        imageLink: null,
        ...{
          // can enter user data here, calorie goals, currentCalories, weight, etc.
          weightInKg: weightInKg + '',
          heightInCm: heightInCm + '',
          age: age + '',
          gender
        }
      }
    },
    callback
  )
}

/**
 * evaluates condition to handle caloriesRemaining fulfillment
 * @function
 * @private
 * @param {@function} intentName
 * @param {*} dialogState
 */
function caloriesRemainingFulfilled(intentName, dialogState) {
  return (
    intentName === 'CaloriesRemaining' &&
    (dialogState === 'ReadyForFulfillment' || dialogState === 'Fulfilled')
  )
}

/**
 * handles bot response depending on intent fulfillment
 * @function
 * @param {Object} user currently logged in user
 * @param {String} user.id user id
 * @param {Object} response object received from lex
 * @param {String} response.intentName identifies intent to be handled
 * @param {String} response.dialogState used to determine if intent is ready for fulfillment
 * @param {Object} response.sessionAttributes attributes that can persist throughout a conversation
 * @param {String} response.sessionAttributes.foodName if defined, will be part of caloriesRemaining result string
 * @param {Object} response.slots contains parameters needed to fulfill intent
 * @returns {String} response message to user
 */

// TODO this needs to be broken up per intent.
async function handleResponseLex(user, response) {
  const {
    intentName,
    slots,
    sessionAttributes,
    dialogState,
    message,
    responseCard
  } = response

  if (caloriesRemainingFulfilled(intentName, dialogState)) {
    const foodName = sessionAttributes.foodName
    return caloriesRemaining(user, foodName)
  } else if (intentName === 'LogFood') {
    if (dialogState === 'Fulfilled') return message
    else if (dialogState === 'ReadyForFulfillment') {
      const foodLog = {
        name: slots.FoodLogName,
        quantity: slots.FoodLogQuantity,
        unit: slots.FoodLogUnit,
        mealTime: slots.MealTime,
        calories: slots.Calories,
        weightInGrams: slots.WeightInGrams
      }
      try {
        const newLog = await saveFoodLog(user, foodLog)
        if (newLog.name) return caloriesRemaining(user, newLog)
        else return newLog
      } catch (err) {
        return err.message
      }
    }
  } else if (
    intentName === 'SetCalorieGoals' &&
    dialogState === 'ReadyForFulfillment'
  ) {
    const dailyGoals = slots.CaloriesPerDay
    try {
      const updateStr = await user.updateDailyGoals(dailyGoals)
      const statusStr = await caloriesRemaining(user)
      return `${updateStr} ${statusStr}`
    } catch (err) {
      return err.message
    }
  } else if (
    intentName === 'QueryExercise' &&
    dialogState === 'ReadyForFulfillment'
  ) {
    const exerciseLog = {
      name: slots.ExerciseQueryName,
      quantity: slots.ExerciseQueryQuantity,
      unit: slots.ExerciseQueryUnit,
      calories: slots.Calories
    }

    try {
      const newLog = await ExerciseLog.saveExerciseLog(user, exerciseLog)
      if (newLog.name) return caloriesRemaining(user, null, exerciseLog)
    } catch (err) {
      return err.message
    }
  } else if (
    intentName === 'LogWorkout' &&
    dialogState === 'ReadyForFulfillment'
  ) {
    try {
      const workoutStr = await Workout.logWorkout(
        user,
        slots.Workout,
        ExerciseLog
      )
      if (!workoutStr)
        return 'Workout does not exist. You can create a new workout.'
      const statusStr = await caloriesRemaining(user)
      return `${workoutStr} ${statusStr}`
    } catch (err) {
      return err.message
    }
  } else if (intentName === 'CreateWorkout' && dialogState === 'Fulfilled') {
    const exercises = JSON.parse(sessionAttributes.workoutToSave)
    const name = slots.WorkoutTitle

    try {
      const newWorkout = await Workout.saveWorkout(
        user,
        name,
        exercises,
        ExerciseLog
      )
      return `Your workout, ${
        newWorkout.name
      }, has been successfully saved. You can now easily log it.`
    } catch (err) {
      return `Error in saving workout ${err}`
    }
  }

  // adding support for response card for specific case in lex.
  // would need to restructure how responses are returned to integrate response cards for other cases.
  if (sessionAttributes.imageLink)
    return {message, imageUrl: sessionAttributes.imageLink}
  if (responseCard) return {message, responseCard}
  return message
}

module.exports = {initiateLex, messageLex, handleResponseLex}
