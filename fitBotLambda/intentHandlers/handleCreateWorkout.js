const {
  close,
  delegate,
  confirmIntent,
  elicitSlot
} = require('../responseHandlers')

const {getExerciseInfo} = require('./handleQueryExercise')

function handleSlotFilling(request) {
  const {sessionAttributes, currentIntent} = request
  const {slots} = currentIntent

  const {WorkoutTitle, ExerciseName, ExerciseQuantity, ExerciseUnit} = slots

  if (!WorkoutTitle) {
    sessionAttributes.workout = null
    return elicitSlot(
      sessionAttributes,
      'CreateWorkout',
      slots,
      'WorkoutTitle',
      'What would you like to name this workout?'
    )
  }

  if (!ExerciseName) {
    return elicitSlot(
      sessionAttributes,
      'CreateWorkout',
      slots,
      'ExerciseName',
      'Please enter an exercise name.'
    )
  }

  if (!ExerciseUnit) {
    const responseCard = {
      buttons: [
        {text: 'seconds', value: 'sec'},
        {text: 'minutes', value: 'min'},
        {text: 'hours', value: 'hr'},
        {text: 'reps', value: 'rep'}
      ]
    }

    return elicitSlot(
      sessionAttributes,
      'CreateWorkout',
      slots,
      'ExerciseUnit',
      'Please select a unit.',
      responseCard
    )
  }

  if (!ExerciseQuantity) {
    return elicitSlot(
      sessionAttributes,
      'CreateWorkout',
      slots,
      'ExerciseQuantity',
      `How many ${ExerciseUnit} did you do ${ExerciseName}?`
    )
  }
}

function handleDialogCodeHook(request) {
  const {sessionAttributes, currentIntent} = request
  const {slots, confirmationStatus} = currentIntent

  const {
    WorkoutTitle,
    ExerciseName,
    ExerciseQuantity,
    ExerciseUnit,
    Calories
  } = slots
  if (!WorkoutTitle) {
    sessionAttributes.workout = null
  }

  if (confirmationStatus === 'Denied') {
    sessionAttributes.workoutToSave = sessionAttributes.workout
    sessionAttributes.workout = null

    let result = JSON.parse(sessionAttributes.workoutToSave),
      resultStr = ''

    result.forEach(exercise => {
      resultStr +=
        '\r\n' +
        exercise.ExerciseName +
        exercise.ExerciseQuantity +
        exercise.ExerciseUnit
    })

    return close(
      sessionAttributes,
      'Fulfilled',
      'Saving Workout ' + WorkoutTitle + ' to database: ' + resultStr
    )
  }

  const {weightInKg, heightInCm, gender, age} = sessionAttributes

  if (!Calories && ExerciseName && ExerciseQuantity && ExerciseUnit) {
    const query = `${ExerciseQuantity} ${ExerciseUnit} of ${ExerciseName}`

    return getExerciseInfo(
      query,
      {weightInKg, heightInCm, gender, age},
      exerciseInfo => {
        const calories = exerciseInfo.exercises[0].nf_calories

        if (!sessionAttributes.workout) sessionAttributes.workout = []
        else sessionAttributes.workout = JSON.parse(sessionAttributes.workout)

        sessionAttributes.workout.push({
          ExerciseName,
          ExerciseQuantity,
          ExerciseUnit,
          Calories: calories
        })

        sessionAttributes.workout = JSON.stringify(
          sessionAttributes.workout,
          null,
          2
        )

        return confirmIntent(
          sessionAttributes,
          'CreateWorkout',
          {
            WorkoutTitle
          },
          `Would you like to add another exercise?`
        )
      },
      err => {
        console.error('here', err.message)
        return close(
          sessionAttributes,
          'Failed',
          'Something went wrong. Please try again.'
        )
      }
    )
  }

  return handleSlotFilling(request)
}

function handleCreateWorkout(request) {
  if (request.invocationSource === 'DialogCodeHook') {
    return handleDialogCodeHook(request)
  }
}

module.exports = {handleCreateWorkout}
