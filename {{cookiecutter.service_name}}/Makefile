init:
	true

# Command to run everytime you make changes to verify everything works
dev: lint test

# Verifications to run before sending a pull request
pr: init dev

export ENV ?= ${USER}
export SERVICE ?= $(shell basename ${CURDIR})
export STACKNAME = $(SERVICE)-$(ENV)

AWS_ACCOUNT ?= $(shell aws sts get-caller-identity | jq -r .Account)
BUCKET ?= $(shell basename ${CURDIR})-pkg-$(ENV)-$(AWS_ACCOUNT)
PACKAGED_TEMPLATE = .aws-sam/packaged-template.yaml
EVENT_SOURCE = {{cookiecutter.event_source}}

.PHONY: build package clean

bucket:
	# Create bucket if it does not exist
	@aws s3api head-bucket --bucket ${BUCKET} 2>/dev/null 1>/dev/null || aws s3 mb s3://${BUCKET}

event:
{%- if cookiecutter.event_source != "other" %}
	# Generate sample event.
{% if cookiecutter.event_source == "apigateway" %}
	## APIG
	# We don't care about the path and resource data being correct because we're
	# assuming we're testing an event that was properly routed to the correct
	# function.
	
	# POST
	# FIXME: This generates a B64 encoded string. Leave this commented until
	# SAM is fixed.
	#sam local generate-event apigateway aws-proxy --stage live --method POST \
		--body "$$(cat '{{cookiecutter.service_name}}/events/{{cookiecutter.function_name}}-msg.json')" > "{{cookiecutter.service_name}}/events/{{cookiecutter.function_name}}-event-{{cookiecutter.event_source}}-post.json"
	sam local generate-event apigateway aws-proxy --stage live --method POST > "events/{{cookiecutter.function_name}}-event-{{cookiecutter.event_source}}-post.json"
	
	# GET
	sam local generate-event apigateway aws-proxy --stage live --method GET > "events/{{cookiecutter.function_name}}-event-{{cookiecutter.event_source}}-get.json"

{% elif cookiecutter.event_source == "cloudwatch-event" or cookiecutter.event_source == "schedule" %}
	## CloudWatch Event
	sam local generate-event cloudwatch scheduled-event > "events/{{cookiecutter.function_name}}-event-{{cookiecutter.event_source}}.json"

{% elif cookiecutter.event_source == "cloudwatch-logs" %}
	## CloudWatch Logs
	sam local generate-event cloudwatch logs > "events/{{cookiecutter.function_name}}-event-{{cookiecutter.event_source}}.json"

{% elif cookiecutter.event_source == "dynamodb" %}
	## DynamoDB
	sam local generate-event dynamodb update > "events/{{cookiecutter.function_name}}-event-{{cookiecutter.event_source}}-update.json"

#{% elif cookiecutter.event_source == "kinesis" %}
# FIXME: this can generate a lot of different events
#	## Kinesis
#	sam local generate-event kinesis

{% elif cookiecutter.event_source == "s3" %}
	## S3
	sam local generate-event s3 put > "events/{{cookiecutter.function_name}}-event-{{cookiecutter.event_source}}-put.json"
	sam local generate-event s3 delete > "events/{{cookiecutter.function_name}}-event-{{cookiecutter.event_source}}-delete.json"

{% elif cookiecutter.event_source == "sns" %}
	## SNS
	sam local generate-event sns notification > "events/{{cookiecutter.function_name}}-event-{{cookiecutter.event_source}}.json"

{% elif cookiecutter.event_source == "sqs" %}
	## SQS
	sam local generate-event sqs > "events/{{cookiecutter.function_name}}-event-{{cookiecutter.event_source}}.json"

{% endif %}
{%- endif %}

build:
	$(info Building application)
	@sam build

package: build bucket
	$(info Creating package)
	@sam package --s3-bucket $(BUCKET) --output-template-file $(PACKAGED_TEMPLATE)

deploy: package
	$(info Deploying to personal development stack)
	@sam deploy --parameter-overrides Environment=$(ENV) --template-file $(PACKAGED_TEMPLATE) --stack-name $(STACKNAME) --capabilities CAPABILITY_IAM

describe:
	$(info Describing stack)
	@aws cloudformation describe-stacks --stack-name $(STACKNAME) --output table --query 'Stacks[0]'

resources:
	$(info Describing stack resources)
	@aws cloudformation describe-stack-resources --stack-name $(STACKNAME) --output table --query 'StackResources[*]'

outputs:
	$(info Displaying stack outputs)
	@aws cloudformation describe-stacks --stack-name $(STACKNAME) --output table --query 'Stacks[0].Outputs'

parameters:
	$(info Displaying stack parameters)
	@aws cloudformation describe-stacks --stack-name $(STACKNAME) --output table --query 'Stacks[0].Parameters'

delete:
	$(info Delete stack)
	@aws cloudformation delete-stack --stack-name $(STACKNAME)

unit-test:
	@npm run test:unit

int-test:	
	@npm run test:int

test:
	@npm run test

lint:
	# Lint code
	true

clean:
	rm -rf .aws-sam

