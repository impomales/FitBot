const {
  close,
  delegate,
  confirmIntent,
  elicitSlot
} = require('../responseHandlers')

function handleCreateWorkout(request) {
  const {sessionAttributes, currentIntent, invocationSource} = request
  const {slots, confirmationStatus} = currentIntent
  const {
    WorkoutTitle,
    ExerciseName,
    ExerciseQuantity,
    ExerciseUnit,
    Calories
  } = slots

  if (invocationSource === 'DialogCodeHook') {
    if (!WorkoutTitle) {
      sessionAttributes.workout = null
    }

    return delegate(sessionAttributes, slots)
  }
}

module.exports = {handleCreateWorkout}
