TIMESTAMP := $(shell date '+%s')

MODEL_NAME ?= image-moderation
MODEL_RUNTIME_VERSION ?= 1.2
MODEL_VERSION ?= $(MODEL_NAME)_$(TIMESTAMP)
MODEL_BUNDLE_PATH ?= bundle/$(MODEL_NAME)/$(MODEL_VERSION)
MODEL_GCS_PATH ?= $(GCS_BUCKET)/$(MODEL_NAME)/$(MODEL_VERSION)
GCS_BUCKET ?= gs://pavlov-models

.PHONY: all
all: train deploy

.PHONY: train
train:
	python3 train.py

.PHONY: create-gcp-model
create-gcp-model:
	@- gcloud ml-engine models create $(MODEL_NAME) \
			--enable-logging \
			--regions us-central1 \
			2> /dev/null

.PHONY: bundle
bundle:
	mkdir -p bundle/$(MODEL_NAME)
	python3 bundle.py $(MODEL_BUNDLE_PATH)

.PHONY: deploy
deploy: create-gcp-model bundle
	gsutil -m cp -r $(MODEL_BUNDLE_PATH) $(MODEL_GCS_PATH)
	gcloud ml-engine versions create $(MODEL_VERSION) \
		--model $(MODEL_NAME) \
		--runtime-version=$(MODEL_RUNTIME_VERSION) \
		--origin $(MODEL_GCS_PATH)
	gcloud ml-engine versions set-default $(MODEL_VERSION) \
		--model $(MODEL_NAME)
