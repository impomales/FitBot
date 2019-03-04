secret = ${RASASECRET}

train-nlu:
	python3 -m rasa_nlu.train -c config.yml --data data/nlu_data.md -o models --fixed_model_name nlu --project current --verbose

train-nlu-json:
	python3 -m rasa_nlu.train -c config.yml --data data/training_data.json -o models --fixed_model_name nlu --project current --verbose

train-core:
	python3 -m rasa_core.train -d domain.yml -s data/stories.md -o models/current/dialogue -c policies.yml

train-core-interactive:
	python3 -m rasa_core.train interactive -d domain.yml -s data/stories.md -o models/current/dialogue --nlu models/current/nlu --endpoints endpoints.yml -c policies.yml

action-server:
	python3 -m rasa_core_sdk.endpoint --actions actions

nlu-server:
	python3 -m rasa_nlu.server --path models/current

core-server:
	python3 -m rasa_core.run --enable_api --auth_token ${secret} -d models/current/dialogue -u models/current/nlu --endpoints endpoints.yml -o rasa_core.log

cmdline:
	python3 -m rasa_core.run -d models/current/dialogue -u models/current/nlu --endpoints endpoints.yml