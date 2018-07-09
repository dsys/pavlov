ELASTICSEARCH_URL ?= http://localhost:9200

.PHONY: seed
seed:
	@ echo "Creating templates..."
	@ cd templates && \
		for f in *.json; do \
			echo templates/$$f =\> PUT /_template/$${f%.json}; \
			curl -XPUT -H Content-Type:application/json -d @$$f \
			$(ELASTICSEARCH_URL)/_template/$${f%.json}; \
		done
	@ echo; echo; echo "Creating indices..."
	@ cat indices.txt | xargs -I{} curl -XPUT $(ELASTICSEARCH_URL)/{} || true
