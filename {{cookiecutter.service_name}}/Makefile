init:
	true

# Command to run everytime you make changes to verify everything works
dev: lint test

# Verifications to run before sending a pull request
pr: init dev

ENV ?= ${USER}
AWS_ACCOUNT = $$(aws sts get-caller-identity | jq -r .Account)
STACKNAME = $$(basename ${CURDIR})-$(ENV)
BUCKET = $$(basename ${CURDIR})-package-bucket-$(ENV)-$(AWS_ACCOUNT)
PACKAGED_TEMPLATE = .aws-sam/packaged-template.yaml
EVENT_SOURCE = {{cookiecutter.event_source}}

check_profile:
	# Make sure we have a user-scoped credentials profile set. We don't want to be accidentally using the default profile
	@aws configure --profile ${AWS_PROFILE} list 1>/dev/null 2>/dev/null || (echo '\nMissing AWS Credentials Profile called '${AWS_PROFILE}'. Run `aws configure --profile ${AWS_PROFILE}` to create a profile called '${AWS_PROFILE}' with creds to your personal AWS Account'; exit 1)


bucket:
	# Create bucket if it does not exist
	@aws --profile ${AWS_PROFILE} s3api head-bucket --bucket ${BUCKET} 2>/dev/null 1>/dev/null || aws --profile ${AWS_PROFILE} s3 mb s3://${BUCKET}

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
	sam build

package: build
	$(info Creating package)
	sam package --profile ${AWS_PROFILE} --s3-bucket $(BUCKET) --output-template-file $(PACKAGED_TEMPLATE)

deploy: bucket package
	$(info Deploying to personal development stack)
	sam deploy --parameter-overrides Environment=$(ENV) --profile ${AWS_PROFILE} --template-file $(PACKAGED_TEMPLATE) --stack-name $(STACKNAME) --capabilities CAPABILITY_IAM

describe:
	$(info Describing stack)
	@aws cloudformation describe-stacks --stack-name $(STACKNAME) --output table --query 'Stacks[0]'

outputs:
	$(info Displaying stack outputs)
	@aws cloudformation describe-stacks --stack-name $(STACKNAME) --output table --query 'Stacks[0].Parameters'

parameters:
	$(info Displaying stack parameters)
	@aws cloudformation describe-stacks --stack-name $(STACKNAME) --output table --query 'Stacks[0].Parameters'

delete:
	$(info Delete stack)
	@aws cloudformation delete-stack --stack-name $(STACKNAME)

unit-test:
	# run unit tests
	true

int-test:
	# run unit tests
	true

test: unit-test int-test
	# Run unit tests
	true

lint:
	# Lint code
	true


