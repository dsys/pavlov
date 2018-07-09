.PHONY: train
train:
	@ docker run \
			-v $(INDEX):/kernns/index \
			-v $(DATASET):/dataset.csv \
			-it cleargraph/kernns:latest \
			train /kernns/index dataset.csv \
			--metric hamming

.PHONY: server
server:
	@ docker run \
			-v $(INDEX):/kernns/index \
			-p 5000:5000 \
			-it cleargraph/kernns:latest

.PHONY: bundle
bundle: TAG=latest
bundle:
	@ rm -rf bundle
	@ mkdir -p bundle/kernns-bundle
	@ cp -R $(INDEX) bundle/kernns-bundle/index
	@ cp -R Dockerfile cli.py requirements.txt kernns bundle/kernns-bundle
	@ echo "COPY index /kernns/index" >> bundle/kernns-bundle/Dockerfile
	@ mono build kernns/bundle/kernns-bundle --tag $(TAG)

.PHONY: push-bundle
push-bundle: TAG=latest
push-bundle: bundle
	@ mono push kernns/bundle/kernns-bundle --tag $(TAG)
