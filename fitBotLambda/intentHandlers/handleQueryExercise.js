const axios = require('axios')
const {isIndefinite} = require('./handleLogFood')
const {close, delegate, confirmIntent} = require('../responseHandlers')

function getExerciseInfo(query, userInfo, success, failure) {
  return axios
    .post(
      'https://trackapi.nutritionix.com/v2/natural/exercise',
      {
        query,
        // eslint-disable-next-line camelcase
        weight_kg: userInfo.weightInKg,
        // eslint-disable-next-line camelcase
        height_cm: userInfo.heightInCm,
        gender: userInfo.gender,
        age: userInfo.age
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
    .then(exerciseInfo => success(exerciseInfo))
    .catch(err => failure(err))
}

function wordToQuantity(slots, inputTranscript, key) {
  // key is used to reuse in different intent that has slightly different key names.
  if (
    isIndefinite(slots[key + 'Name'], slots[key + 'Quantity'], inputTranscript)
  ) {
    slots[key + 'Quantity'] = '1'
  }

  if (inputTranscript.includes('half') && inputTranscript.includes('hour')) {
    slots[key + 'Quantity'] = '30'
    slots[key + 'Unit'] = 'min'
  }
}

function handleQueryExercise(request) {
  const {sessionAttributes, currentIntent, inputTranscript} = request
  const {slots, confirmationStatus} = currentIntent

  wordToQuantity(slots, inputTranscript, 'ExerciseQuery')

  let {
    ExerciseQueryName,
    ExerciseQueryUnit,
    ExerciseQueryQuantity,
    Calories
  } = slots
  const {weightInKg, heightInCm, gender, age} = sessionAttributes

  if (confirmationStatus === 'Denied') {
    return close(
      sessionAttributes,
      'Fulfilled',
      `OK. I won't log ${ExerciseQueryName}`
    )
  }

  if (
    !Calories &&
    ExerciseQueryName &&
    ExerciseQueryQuantity &&
    ExerciseQueryUnit
  ) {
    const query = `${ExerciseQueryQuantity} ${ExerciseQueryUnit} of ${ExerciseQueryName}`

    return getExerciseInfo(
      query,
      {weightInKg, heightInCm, gender, age},
      exerciseInfo => {
        const calories = exerciseInfo.exercises[0].nf_calories
        return confirmIntent(
          sessionAttributes,
          'QueryExercise',
          {
            ExerciseQueryName,
            ExerciseQueryQuantity,
            ExerciseQueryUnit,
            Calories: calories
          },
          `${ExerciseQueryName} for ${ExerciseQueryQuantity} ${ExerciseQueryUnit} burns ${calories} calories. Would you like to log this exercise?`
        )
      },
      err => {
        console.error('here', err.message)
        return close(
          sessionAttributes,
          'Failed',
          `Something went wrong. Please try again.`
        )
      }
    )
  }

  return delegate(sessionAttributes, {
    ExerciseQueryName,
    ExerciseQueryQuantity,
    ExerciseQueryUnit,
    Calories
  })
}

module.exports = {
  handleQueryExercise,
  wordToQuantity,
  getExerciseInfo
}
