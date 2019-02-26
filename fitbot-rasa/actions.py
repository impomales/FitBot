# -*- coding: utf-8 -*-
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import logging
import requests
import json
import inflect
import yaml
from rasa_core_sdk import Action
from rasa_core_sdk.events import SlotSet
from rasa_core_sdk.forms import FormAction

logger = logging.getLogger(__name__)
p = inflect.engine()

# actions
class ActionGetNutritionInfo(Action):
    def name(self):
        return "action_get_nutrition_info"

    def run(self, dispatcher, tracker, domain):
        url = 'https://trackapi.nutritionix.com/v2/natural/nutrients'
        food = tracker.get_slot("food")
        quantity = tracker.get_slot("quantity")
        unit = tracker.get_slot("unit")

        query = buildFoodQuery(food, quantity, unit)

        with open("./credentials.yml", 'r') as ymlfile:
            cfg = yaml.load(ymlfile)

        id = cfg['NUTRITION_API_ID']
        key = cfg['NUTRITION_API_KEY']

        request = json.loads(requests.post(url, data = { 'query': query }, headers = { 
            'x-app-id': str(id),
            'x-app-key': str(key),
            'x-remote-user-id': "0"}).text)

        info = request['foods'][0]
        
        return [SlotSet("calories", info['nf_calories'])]

class ActionResetFood(Action):
    def name(self):
        return "action_reset_food"
    
    def run(self, dispatcher, tracker, domain):
        return [SlotSet("food", None), SlotSet("unit", None), SlotSet("quantity", None), SlotSet("calories", None)]

# forms
class QueryFoodForm(FormAction):
    def name(self):
        return "query_food_form"
    
    @staticmethod
    def required_slots(tracker):
        quantity = tracker.get_slot("quantity")
        if quantity:
            return ["food"]
        return ["food", "unit", "quantity"]

    def submit(self, dispatcher, tracker, domain):
        dispatcher.utter_message('Fetching nutrition info from server')
        return []

# helpers
def buildFoodQuery(food, quantity, unit):
  if unit:
    return f"{quantity} {unit} of {food}"
  else:
    return f"{quantity} {p.plural(food, quantity)}"


# class ActionJoke(Action):
#     def name(self):
#         # define the name of the action which can then be included in training stories
#         return "action_joke"

#     def run(self, dispatcher, tracker, domain):
#         # what your action should do
#         request = json.loads(requests.get('https://api.chucknorris.io/jokes/random').text)  # make an api call
#         joke = request['value']  # extract a joke from returned json response
#         dispatcher.utter_message(joke)  # send the message back to the user
#         return []

# class MyForm(FormAction):
#     def name(self):
#         return "my_form"

#     @staticmethod
#     def required_slots(tracker):
#         return ["email"]

#     def submit(self, dispatcher, tracker, domain):
#         dispatcher.utter_template('utter_submit', tracker)
#         return []

