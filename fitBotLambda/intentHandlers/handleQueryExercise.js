const axios = require('axios')
const {close} = require('../responseHandlers')

function handleQueryExercise(request) {
  const {sessionAttributes, currentIntent} = request
  const slots = currentIntent.slots

  const {ExerciseQueryName, ExerciseQueryUnit, ExerciseQueryQuantity} = slots
  const {weightInKg, heightInCm, gender, age} = sessionAttributes

  const query = `${ExerciseQueryQuantity} ${ExerciseQueryUnit} of ${ExerciseQueryName}`

  return axios
    .post(
      'https://trackapi.nutritionix.com/v2/natural/exercise',
      {
        query,
        // eslint-disable-next-line camelcase
        weight_kg: weightInKg,
        // eslint-disable-next-line camelcase
        height_cm: heightInCm,
        gender,
        age
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
    .then(exerciseInfo => {
      const calories = exerciseInfo.exercises[0].nf_calories
      return close(
        sessionAttributes,
        'Fulfilled',
        `${ExerciseQueryName} for ${ExerciseQueryQuantity} ${ExerciseQueryUnit} burns ${calories} calories. Would you like to log this exercise?`
      )
    })
    .catch(err => {
      console.error('here', err.message)
      return close(
        sessionAttributes,
        'Failed',
        `Something went wrong. Please try again.`
      )
    })
}

module.exports = {
  handleQueryExercise
}
