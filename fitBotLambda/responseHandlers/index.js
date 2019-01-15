function close(sessionAttributes, fulfillmentState, message) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Close',
      fulfillmentState,
      message: {
        contentType: 'PlainText',
        content: message
      }
    }
  }
}

function elicitSlot(
  sessionAttributes,
  intentName,
  slots,
  slotToElicit,
  message
) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'ElicitSlot',
      intentName,
      slots,
      slotToElicit,
      message: {
        contentType: 'PlainText',
        content: message
      }
    }
  }
}

function elicitIntent(sessionAttributes, message) {
  return {
    sessionAttributes,
    dialogAction: {
      type: ELICIT_INTENT,
      message: {
        contentType: 'PlainText',
        content: message
      }
    }
  }
}

module.exports = {
  elicitSlot,
  elicitIntent
}
