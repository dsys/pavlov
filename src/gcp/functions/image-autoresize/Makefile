export NODE_ENV ?= production

FUNCTION_NAME ?= image-autoresize
MEMORY ?= 2048MB
TIMEOUT ?= 30
STAGE_BUCKET ?= pavlov-image-autoresize
ENTRY_POINT ?= run
TRIGGER_BUCKET ?= pavlov-images

.PHONY: deploy
deploy: build
	gcloud beta functions \
		deploy $(FUNCTION_NAME) \
		--source build \
		--retry \
		--memory $(MEMORY) \
		--timeout $(TIMEOUT) \
		--stage-bucket $(STAGE_BUCKET) \
		--entry-point $(ENTRY_POINT) \
		--trigger-bucket $(TRIGGER_BUCKET)

.PHONY: deploy
deploy-dev: export NODE_ENV = development
deploy-dev: FUNCTION_NAME = image-autoresize-dev
deploy-dev: TRIGGER_BUCKET = pavlov-images-dev
deploy-dev: deploy

.PHONY: build
build: clean
	@ `yarn bin`/babel . --out-dir build --ignore node_modules,build
	@ cp package.json build/package.json
	@ cp ../../../../etc/gcp/image-functions.json build/key.json

.PHONY: clean
clean:
	@- rm -rf build
