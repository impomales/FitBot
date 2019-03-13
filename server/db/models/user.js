const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  weight: {
    // weight is in lbs.
    type: Sequelize.INTEGER
  },
  height: {
    // height is in inches.
    type: Sequelize.INTEGER
  },
  dateOfBirth: {
    type: Sequelize.DATE
  },
  dailyGoals: {
    // daily caloric goal
    type: Sequelize.INTEGER,
    defaultValue: 2000
  },
  googleId: {
    type: Sequelize.STRING
  }
})

module.exports = User

User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

User.prototype.updateDailyGoals = async function(dailyGoals) {
  try {
    await this.update({dailyGoals})
    return 'Daily goals successfully updated.'
  } catch (err) {
    return `Error in updating daily goals ${err}`
  }
}

User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
