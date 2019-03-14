const axios = require('axios')
const {close, delegate, confirmIntent} = require('../responseHandlers')

function handleQueryExercise(request) {
  const {sessionAttributes, currentIntent} = request
  const {slots, confirmationStatus} = currentIntent

  const {
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

  return delegate(sessionAttributes, slots)
}

module.exports = {
  handleQueryExercise
}
