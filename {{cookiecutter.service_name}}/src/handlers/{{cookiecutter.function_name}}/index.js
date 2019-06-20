const asyncStarterService = require("./lib/asyncStarterService")

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.handler = async (event, context) => {
    try {
        let { message } = event.queryStringParameters;

        if( !message ) {
            throw({
                statusCode: 400,
                body: JSON.stringify({
                    message: "Please specify message to strip whitespaces from"
                })
            })
        }

        const ret = await asyncStarterService.stripWhitespaces(message);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: ret,
            })
        }
    } catch (err) {
        return err;
    }

    return response
};

