export NODE_ENV ?= development

ifndef FUNCTION_NAME
$(error FUNCTION_NAME is not set)
endif

ifndef GCP_KEY
$(error GCP_KEY is not set)
endif

MEMORY ?= 2048MB
TIMEOUT ?= 30
STAGE_BUCKET ?= pavlov-$(FUNCTION_NAME)
ENTRY_POINT ?= run
MANIFEST ?=

.PHONY: install
install:
	@ yarn install

.PHONY: deploy
deploy: build
	gcloud beta functions \
		deploy $(FUNCTION_NAME)-dev \
		--source build \
		--memory $(MEMORY) \
		--timeout $(TIMEOUT) \
		--stage-bucket $(STAGE_BUCKET)-dev \
		--entry-point $(ENTRY_POINT) \
		--trigger-http

.PHONY: deploy
deploy-production: export NODE_ENV := production
deploy-production: build
	gcloud beta functions \
		deploy $(FUNCTION_NAME) \
		--source build \
		--memory $(MEMORY) \
		--timeout $(TIMEOUT) \
		--stage-bucket $(STAGE_BUCKET) \
		--entry-point $(ENTRY_POINT) \
		--trigger-http

.PHONY: build
build: clean
	@ ../../node_modules/.bin/babel . --out-dir build --ignore node_modules,build
	@ cp package.json build/package.json
	@ for f in $(MANIFEST); do cp $$f build; done
	@ cp ../../../../etc/gcp/$(GCP_KEY) build/key.json

.PHONY: clean
clean:
	@- rm -rf build
