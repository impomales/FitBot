# Chatbot Intro Project

## Build

* createdb fitbot
* npm install
* npm run seed
* add secret files to root project directory

## production

* npm start

## development

* npm run start-dev-dialog-flow
* npm run start-dev-lex

## Running unit tests

* createdb fitbot-test
* npm test

## test dialog flow

* npm run unit

## test lex

* npm run unit-lex

## Bot Design

[planning intents and entities](https://console.bluemix.net/docs/services/conversation/intents-entities.html)

[agent design checklist](https://dialogflow.com/docs/agents/AgentDesignChecklist.pdf)

## Running end-to-end tests

* create a folder 'bin' in root directory
* download [selenium-server-standalone-VERSION.jar](http://selenium-release.storage.googleapis.com/index.html) and place in bin

## test dialog-flow

* npm run start-dev-dialog-flow
* npm run end2end

## test lex

* npm run start-dev-lex
* npm run end2end

# Introduction

This project will serve as an introduction to the CBA practice at (Cedrus)[http://cedrus.digital]. As a member of the CBA team, you will be expected to be heavily involved with both automation (RPA) and machine learning (AI/ML).

This project is designed to provide experience working with multiple platforms for Chatbots (required is use of either Watson Assistant and Amazon Lex and a second of your choice).

The chatbot's purpose can be your choice but should be able to help a user solve some kind of problem and be capable of using an external API to get the user useful information.

A leisurely example might be a chatbot assist you in finding a TV show or Movie to watch.
A more practical (preferred) example could be an internal app to help book a conference room at Galvanize. Both would require the date, time, number of users, and to incorporate with an external system.

## Requirements

* UI build in framework of your choosing
* Chat input with scrollable chat history
* Dynamic response nodes that may include:
* Customs styles
* External links
* Link Previews
* Generated Documenation using library of your choice
* Login with User Authentication
* Build chatbot using minimally 2 AI platforms (Watson Assistant and Amazon Lex)
* NodeJs Backend
* End to End and Unit testing
* Ability to select chatbot platform by app launch configuration
* Deployment procedure configurable by environment.
* Source Control w/ Git with appropriate branch management.
* Protection of assets (API keys and any proprietary info should not be committed)

## Nice to have

* CI Deployment
* Additional Chatbot Platforms
* Containerization

## Phase I

The major technical concepts will cover:

* Feature-branch development with git
* Automated testing
* API
* Browser DOM, XPath, and CSS selectors
* Containers and VM's

Key software methodoloy concepts:

* Sprints and milestone tracking
* Kanban boards (feature development)
* Bug tracking / QA
* Sofware delivery and deployment
* Automatable and repeatable processes

### Getting started

* Create a source code repo using github, gitlab, or bitbucket
* Create a kanban board
* Create a project wiki (for Release Notes)
* Create your development environment

During this phase you should do some basic setup and configure you development environment, build process and automated testing process. Depending on your chosen framework some tooling may be be provided out of the box.

The first view should be a login page with a username an password field.

This is good time to verify that your end to end tests are working. You should have a test verifying the expected rendering of your login form.

You should also have a unit test verifying connectivity with one of the chat platforms

### Note

The details and suggestions for this project will grow and likely change but this is a good place to start

Use this file for the README.md in the project, placing whatever you think is important at the top of this file

## API DOCS

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

* [initiateDialogFlow](#initiatedialogflow)
  * [Parameters](#parameters)
* [messageDialogFlow](#messagedialogflow)
  * [Parameters](#parameters-1)
* [handleResponseDialogFlow](#handleresponsedialogflow)
  * [Parameters](#parameters-2)
* [Bot](#bot)
  * [Parameters](#parameters-3)
  * [Properties](#properties)
* [initiateLex](#initiatelex)
  * [Parameters](#parameters-4)
* [messageLex](#messagelex)
  * [Parameters](#parameters-5)
* [handleResponseLex](#handleresponselex)
  * [Parameters](#parameters-6)
* [initiateWatson](#initiatewatson)
  * [Parameters](#parameters-7)
* [messageWatson](#messagewatson)
  * [Parameters](#parameters-8)
* [handleResponseWatson](#handleresponsewatson)
  * [Parameters](#parameters-9)

### initiateDialogFlow

initiates the dialog flow bot

#### Parameters

* `user` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** currently logged in user
  * `user.id` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** user id

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** session id

### messageDialogFlow

sends user input to Dialog Flow

#### Parameters

* `sessionUserId` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** id used to reference current session with user
* `text` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** input text user is sending
* `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** function that handles error, or sends response back to user

### handleResponseDialogFlow

handles bot response depending on intent name and if all requeired params are present

#### Parameters

* `user` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** currently logged in user
* `response` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** object received from dialog flow
  * `response.fulfillmentText` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** default response sent from dialog flow
  * `response.allRequiredParamsPresent` **[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if all required params are present for fulfillment
  * `response.intent` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** contains info about current intent
  * `response.parameters` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** contains parameters obtained through slot filling
  * `response.outputContexts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** contains parameters within contexts persisted throughout the conversation

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** response message to user

### Bot

bot object client interacts with.

#### Parameters

* `type` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** identifies the bot service (Lex, Watson, or DialogFlow)

#### Properties

* `initiate` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** creates a new service instance, returns a session id
* `message` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** sends a user input, callback returns a response to user
* `handleResponse` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** handles intent fulfillment, this is called within the callback of this.message

### initiateLex

initiates the lex service

#### Parameters

* `user` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** currently logged in user
  * `user.id` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** user id

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** session id

### messageLex

sends user input to Lex

#### Parameters

* `sessionUserId` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** id used to reference current session with user
* `text` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** input text user is sending
* `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** function that handles error, or sends response back to user

### handleResponseLex

handles bot response depending on intent fulfillment

#### Parameters

* `user` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** currently logged in user
  * `user.id` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** user id
* `response` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** object received from lex
  * `response.intentName` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** identifies intent to be handled
  * `response.dialogState` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** used to determine if intent is ready for fulfillment
  * `response.sessionAttributes` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** attributes that can persist throughout a conversation
    * `response.sessionAttributes.foodName` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** if defined, will be part of caloriesRemaining result string
  * `response.slots` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** contains parameters needed to fulfill intent

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** response message to user

### initiateWatson

initiates the watson service

#### Parameters

* `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** sends session id back to user

### messageWatson

sends user input to Watson

#### Parameters

* `sessionUserId` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** id used to reference current session with user
* `text` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** input text user is sendng
* `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** function that handles error, or sends response back to user

### handleResponseWatson

handles bot response depending on action object

#### Parameters

* `user` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** currently logged in user
  * `user.id` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** user id
* `response` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** object received from watson, contains action parameters needed to handle action

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** response message to user

## FULFILLMENT HANDLERS

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

## FRONT END DOCS

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents
