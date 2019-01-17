# Chatbot Intro Project

## Build

* createdb fitbot
* npm install
* npm start // production
* npm run start-dev // development

## Running unit tests

* createdb fitbot-test
* npm install
* npm test

## Running end-to-end tests

* create a folder 'bin' in root directory
* download [selenium-server-standalone-VERSION.jar](http://selenium-release.storage.googleapis.com/index.html) and place in bin
* npm install
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
