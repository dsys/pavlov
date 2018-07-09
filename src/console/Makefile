.PHONY: all
all: test

.PHONY: pre-build
pre-build:
	@ cp ../bull/config.json ./queues/config.json

.PHONY: install
install:
	@ yarn install

.PHONY: test
test:
	@ ./node_modules/.bin/jest --forceExit

.PHONY: watch
watch:
	@ ./node_modules/.bin/jest --forceExit --watch --notify
