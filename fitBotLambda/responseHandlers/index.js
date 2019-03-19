// doesn't expect anything from user
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

// expects next input to contain a slot to fill
function elicitSlot(
  sessionAttributes,
  intentName,
  slots,
  slotToElicit,
  message,
  responseCard
) {
  const result = {
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

  if (responseCard) {
    result.dialogAction.responseCard = {
      contentType: 'application/vnd.amazonaws.card.generic',
      genericAttachments: [
        {
          buttons: responseCard.buttons
        }
      ]
    }
  }

  return result
}

// expects next input to be an intent utterance
function elicitIntent(sessionAttributes, message) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'ElicitIntent',
      message: {
        contentType: 'PlainText',
        content: message
      }
    }
  }
}

// expects next input to be 'yes' or 'no', can be used to invoke another intent
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

// surrenders control back to original bot config defined in console
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
