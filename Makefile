.PHONY: server serverCleanUp serverApi serverGenerationCleanUp \
		client clientApi clientCleanUp clientGenerationCleanUp

# global variables
ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
USER_AND_GROUP=$(shell id -u):$(shell id -g)
GENERATOR_IMAGE=openapitools/openapi-generator-cli
GENERATOR_COMMAND=generate
SWAGGER_FILE=openapi-generator/swagger.yaml

# spring variables
SPRING_DIR=backend
SPRING_BASE_PACKAGE=hu.hollo.news
SPRING_API_PACKAGE=api
SPRING_MODEL_PACKAGE=model.dto
SPRING_API_DIR=src/main/kotlin/hu/hollo/news/api
SPRING_MODEL_DIR=src/main/kotlin/hu/hollo/news/model/dto

# angular variables
ANGULAR_DIR=frontend
ANGULAR_API_DIR=src/app/core/api

# spring targets
server:	serverCleanUp serverApi serverGenerationCleanUp

serverApi:
	docker run --rm \
	--user ${USER_AND_GROUP} \
	-v ${ROOT_DIR}/:/local \
	${GENERATOR_IMAGE} ${GENERATOR_COMMAND} \
	-i /local/${SWAGGER_FILE} \
	-g kotlin-spring \
	--additional-properties=interfaceOnly=true \
	--additional-properties=documentationProvider=none \
	--additional-properties=gradleBuildFile=false \
	--additional-properties=serializationLibrary=jackson \
	--additional-properties=modelNameSuffix=Dto \
	--additional-properties=exceptionHandler=false \
	--additional-properties=apiPackage=${SPRING_BASE_PACKAGE}.${SPRING_API_PACKAGE} \
	--additional-properties=modelPackage=${SPRING_BASE_PACKAGE}.${SPRING_MODEL_PACKAGE} \
	-o /local/${SPRING_DIR}/ \

serverCleanUp:
	rm -rfv ${SPRING_DIR}/${SPRING_API_DIR} \
	&& \
	rm -rfv ${SPRING_DIR}/${SPRING_MODEL_DIR}

serverGenerationCleanUp:
	rm -fv ${SPRING_DIR}/pom.xml ${SPRING_DIR}/README.md ${SPRING_DIR}/pom.xml

# angular targets

client: clientCleanUp clientApi clientGenerationCleanUp

clientApi:
	docker run --rm \
    	--user ${USER_AND_GROUP} \
    	-v ${ROOT_DIR}/:/local \
    	${GENERATOR_IMAGE} ${GENERATOR_COMMAND} \
    	-i /local/${SWAGGER_FILE} \
    	-g typescript-angular \
		--additional-properties=fileNaming=kebab-case \
		--additional-properties=providedIn=none \
		--additional-properties=stringEnums=true \
		--additional-properties=supportsES6=true \
		--additional-properties=modelSuffix=Dto \
		--additional-properties=modelFileSuffix=-dto \
		--additional-properties=serviceSuffix=ApiService \
		--additional-properties=serviceFileSuffix=-api.service \
		--additional-properties=withInterfaces=true \
    	-o /local/${ANGULAR_DIR}/${ANGULAR_API_DIR} \

clientCleanUp:
	rm -rfv ${ANGULAR_DIR}/${ANGULAR_API_DIR}

clientGenerationCleanUp:
	rm -fv \
	${ANGULAR_DIR}/${ANGULAR_API_DIR}/README.md \
	${ANGULAR_DIR}/${ANGULAR_API_DIR}/git_push.sh \
	${ANGULAR_DIR}/${ANGULAR_API_DIR}/.gitignore
