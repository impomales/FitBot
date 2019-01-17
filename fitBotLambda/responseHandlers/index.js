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
      type: 'ElicitItent',
      message: {
        contentType: 'PlainText',
        content: message
      }
    }
  }
}

function confirmIntent(sessionAttributes, intentName, slots, message) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'ConfirmIntent',
      message: {
        contentType: 'PlainText',
        content: message
      },
      intentName,
      slots
    }
  }
}

function delegate(sessionAttributes, slots) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Delegate',
      slots
    }
  }
}

module.exports = {
  close,
  elicitSlot,
  elicitIntent,
  confirmIntent,
  delegate
}
