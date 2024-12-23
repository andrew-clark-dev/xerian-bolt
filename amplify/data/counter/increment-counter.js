import { util } from '@aws-appsync/utils';

export function request(ctx) {
  return {
    operation: 'UpdateItem',
    key: util.dynamodb.toMapValues({ name: ctx.args.name }),
    update: {
      expression: 'ADD val :plusOne',
      expressionValues: { ':plusOne': { N: 1 } },
    }
  }
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result
}
