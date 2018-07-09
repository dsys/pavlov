ADAPTER ?= postgresql
ENV ?= development
HOST ?= localhost
PORT ?= 5432
USERNAME ?= laika
PASSWORD ?= comehome
DATABASE ?= cleargraph-$(ENV)
PROJECT_ID ?= cleargraph-mono

ifeq ($(ADAPTER),postgresql)
DATABASE_URL ?= 'postgres://$(USERNAME):$(PASSWORD)@$(HOST):$(PORT)/$(DATABASE)?sslmode=disable'
else
DATABASE_URL ?= 'spanner://projects/$(PROJECT_ID)/instances/$(DATABASE)/databases/$(DATABASE)'
endif

.PHONY: install
install:
	@ go get -u -d github.com/mattes/migrate/cli github.com/lib/pq cloud.google.com/go/spanner github.com/googleapis/gax-go
	@ go build -tags 'postgres spanner' -o /usr/local/bin/migrate github.com/mattes/migrate/cli

.PHONY: create
create:
	@ if test -z $(NAME); then echo "undefined migration NAME"; exit 1; fi
	@ migrate create -dir postgresql -ext sql $(NAME)
	@ migrate create -dir spanner -ext sql $(NAME)

.PHONY: up
up:
	@- if [[ $(ADAPTER) = postgres ]] && [[ $(HOST) = localhost ]]; then \
			PGPASSWORD=$(PASSWORD) createdb -h $(HOST) -p $(PORT) -U $(USERNAME) $(DATABASE) 2> /dev/null || true; \
		fi
	@ migrate -path $(ADAPTER) -database $(DATABASE_URL) up

.PHONY: down
down:
	@ migrate -path $(ADAPTER) -database $(DATABASE_URL) down 1

.PHONY: force
force:
	@ if test -z $(VERSION); then echo "undefined version VERSION"; exit 1; fi
	@ migrate -path $(ADAPTER) -database $(DATABASE_URL) force $(VERSION)
