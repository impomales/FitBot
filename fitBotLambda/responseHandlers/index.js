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

module.exports = {
  elicitSlot
}
