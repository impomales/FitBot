## story_greet
* greeting
    - utter_greet

## story_bye
* bye
    - utter_bye

## story_help
* help 
    - utter_help

## story_status
* status
    - action_get_status

## story_query_food_confirm
* query-food
    - query_food_form
    - form{"name": "query_food_form"}
    - form{"name": null}
    - action_get_nutrition_info
    - slot{"calories": "500"}
* confirm
    - utter_ask_mealtime
* inform{"mealtime": "lunch"}
    - action_log_food
    - action_reset_food

## story_query_food_deny
* query-food
    - query_food_form
    - form{"name": "query_food_form"}
    - form{"name": null}
    - action_get_nutrition_info
    - slot{"calories": "500"} 
* deny
    - utter_deny_message
    - action_reset_food

## Generated Story 924398762212695510
* greeting
    - utter_greet
* out_of_scope
    - action_default_fallback
    - rewind

## Generated Story 1078884622455770252
* greeting
    - utter_greet
* help
    - utter_help
* query-food{"quantity": "2", "unit": "glass", "food": "wine"}
    - slot{"food": "wine"}
    - slot{"quantity": "2"}
    - slot{"unit": "glass"}
    - query_food_form
    - form{"name": "query_food_form"}
    - slot{"food": "wine"}
    - form{"name": null}
    - slot{"requested_slot": null}
    - action_get_nutrition_info
    - slot{"calories": 244.02}
* confirm
    - utter_ask_mealtime
* inform{"mealtime": "Dinner"}
    - slot{"mealtime": "Dinner"}
    - action_log_food
    - action_reset_food
    - slot{"food": null}
    - slot{"unit": null}
    - slot{"quantity": null}
    - slot{"calories": null}
    - slot{"mealtime": null}

## Generated Story -7454799090469032761
* greeting
    - utter_greet
* help
    - utter_help
* query-food{"quantity": "1", "unit": "loaf", "food": "bread"}
    - slot{"food": "bread"}
    - slot{"quantity": "1"}
    - slot{"unit": "loaf"}
    - query_food_form
    - form{"name": "query_food_form"}
    - slot{"food": "bread"}
    - form{"name": null}
    - slot{"requested_slot": null}
    - action_get_nutrition_info
    - slot{"calories": 2005.64}
* deny
    - utter_deny_message
    - action_reset_food
    - slot{"food": null}
    - slot{"unit": null}
    - slot{"quantity": null}
    - slot{"calories": null}
    - slot{"mealtime": null}
* query-food
    - query_food_form
    - form{"name": "query_food_form"}
    - slot{"requested_slot": "food"}
* form: inform{"food": "steak"}
    - slot{"food": "steak"}
    - form: query_food_form
    - slot{"food": "steak"}
    - slot{"requested_slot": "unit"}
* form: inform{"unit": "lb"}
    - slot{"unit": "lb"}
    - form: query_food_form
    - slot{"unit": "lb"}
    - slot{"requested_slot": "quantity"}
* form: inform{"quantity": "0.25"}
    - slot{"quantity": "0.25"}
    - form: query_food_form
    - slot{"quantity": "0.25"}
    - form{"name": null}
    - slot{"requested_slot": null}
    - action_get_nutrition_info
    - slot{"calories": 315.25}
* confirm
    - utter_ask_mealtime
* inform{"mealtime": "Lunch"}
    - slot{"mealtime": "Lunch"}
    - action_log_food
    - action_reset_food
    - slot{"food": null}
    - slot{"unit": null}
    - slot{"quantity": null}
    - slot{"calories": null}
    - slot{"mealtime": null}

