import { util } from '@aws-appsync/utils';

export function request(ctx) {
  return {
    operation: 'UpdateItem',
    key: util.dynamodb.toMapValues({ name: ctx.args.name }),
    update: {
      expression: 'ADD count :plusOne',
      expressionValues: { ':plusOne': { N: 1 } },
    }
  }
}

export function response(ctx) {
  return ctx.result
}