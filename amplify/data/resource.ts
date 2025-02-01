import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';
import { createActionFunction } from '../function/create-action/resource';
import { findExternalAccount } from './external-account/resource';
import { importAccountFunction } from '../function/import-accounts/resource';
import { findExternalItem } from './external-item/resource';
import { fetchItemsFunction } from '../function/import-items/resource';
import { importItemFunction } from '../function/import-items/resource';
import { resetDataFunction } from '../function/reset-data/resource';

export const schema = a.schema({

  // Models
  AppConfig: a
    .model({
      name: a.string().required(),
      value: a.string(),
    })
    .identifier(['name']),

  Counter: a
    .model({
      name: a.string().required(),
      val: a.integer().required(),

    })
    .identifier(['name']),

  // Increment Counter identified by name by 1
  incCounter: a
    .mutation()
    .arguments({
      name: a.string()
    })
    .returns(a.ref('Counter'))
    .handler(a.handler.custom({
      dataSource: a.ref('Counter'),
      entry: './counter/increment-counter.js'
    })),


  Action: a
    .model({
      description: a.string().required(),
      actor: a.string(),
      modelName: a.string(),
      refId: a.id(), // Loose coupling for now
      type: a.enum(["Create", "Read", "Update", "Delete", "Search", "Import", "Export", "Increment", "Decrement", "Auth"]),
      typeIndex: a.string().required(),
      userId: a.id(),
      createdBy: a.belongsTo('UserProfile', 'userId'),
      before: a.json(),
      after: a.json(),
    })
    .secondaryIndexes((index) => [index("refId"), index("userId"), index("typeIndex")]),

  Comment: a
    .model({
      text: a.string().required(),
      refId: a.id().required(), // Lose coupling for now
      createdAt: a.datetime(),
      userId: a.id(),
      createdBy: a.belongsTo('UserProfile', 'userId'),
      updatedAt: a.datetime(),
    })
    .authorization(allow => [allow.owner(), allow.group('Admin'), allow.authenticated().to(['read'])]),

  UserProfile: a
    .model({
      email: a.string(),
      profileOwner: a.string(),
      cognitoName: a.string(), // the cognito name not for display
      nickname: a.string(), // the display name
      phoneNumber: a.string(),
      status: a.enum(["Active", "Inactive", "Suspended", "Pending"]),
      role: a.enum(["Admin", "Manager", "Employee", "Service", "Guest"]),
      photo: a.url(),

      comments: a.hasMany('Comment', 'userId'),
      actions: a.hasMany('Action', 'userId'),

      settings: a.json(),
      deletedAt: a.datetime(),

    })
    .secondaryIndexes((index) => [
      index("cognitoName"),
      index("email"),
    ])
    .authorization((allow) => [
      allow.ownerDefinedIn("profileOwner"),
      allow.group('Admin')
    ]),

  Account: a
    .model({
      id: a.id(),
      number: a.string().required(),
      lastActivityBy: a.id().required(),
      firstName: a.string(),
      lastName: a.string(),
      email: a.string(),
      phoneNumber: a.string(),
      isMobile: a.boolean().default(false),
      addressLine1: a.string(),
      addressLine2: a.string(),
      city: a.string(),
      state: a.string(),
      postcode: a.string(),
      comunicationPreferences: a.enum(["TextMessage", "Email", "Whatsapp", "None"]),
      status: a.enum(["Active", "Inactive", "Suspended"]),
      kind: a.enum(["Standard", "VIP", "Vender", "Employee", "Customer", "Owner"]),
      defaultSplit: a.integer(),
      items: a.hasMany("Item", "accountNumber"), // setup relationships between main types
      transactions: a.hasMany("Transaction", "accountNumber"), // setup relationships between types
      balance: a.integer().default(0),
      noSales: a.integer().default(0),
      noItems: a.integer().default(0),
      lastActivityAt: a.datetime(),
      lastItemAt: a.datetime(),
      lastSettlementAt: a.datetime(),
      tags: a.string().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      deletedAt: a.datetime(),
    })
    .identifier(['number'])
    .secondaryIndexes((index) => [
      index("id"),
      index("status"),
      index("deletedAt").sortKeys(["number", "createdAt", "balance"]),
    ]),

  findExternalAccount: a
    .query()
    // arguments that this query accepts
    .arguments({
      query: a.string().required()
    })
    // return type of the query
    .returns(a.ref('Account'))
    .handler(a.handler.function(findExternalAccount)),

  ItemStatus: a.enum(['Created', 'Tagged', 'Active', 'Sold', 'ToDonate', 'Donated', 'Parked', 'Returned', 'Expired', 'Lost', 'Stolen', 'Unknown']),

  Item: a
    .model({
      id: a.id(),
      sku: a.string().required(),
      lastActivityBy: a.id().required(),
      title: a.string(),
      account: a.belongsTo("Account", "accountNumber"),
      accountNumber: a.string(),
      category: a.string(),
      brand: a.string(),
      color: a.string(),
      size: a.string(),
      description: a.string(),
      details: a.string(),
      images: a.url().array(), // fields can be arrays,
      condition: a.enum(['AsNew', 'Good', 'Marked', 'Damaged', 'Unknown', 'NotSpecified']),
      split: a.integer(),
      price: a.integer(),
      status: a.ref('ItemStatus'), // this is the status of unique items.
      group: a.hasOne('ItemGroup', 'itemSku'), // this is the group of items that are the same. 
      transactions: a.hasMany("Transaction", "itemSku"), // setup relationships between types
      printedAt: a.datetime(),
      lastSoldAt: a.datetime(),
      lastViewedAt: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      deletedAt: a.datetime(),
    })
    .identifier(['sku'])
    .secondaryIndexes((index) => [
      index("id"),
      index("deletedAt").sortKeys(["accountNumber", "category", "brand", "color", "size"]),
    ]),

  findExternalItem: a
    .query()
    // arguments that this query accepts
    .arguments({
      query: a.string().required()
    })
    // return type of the query
    .returns(a.ref('Item'))
    .handler(a.handler.function(findExternalItem)),

  ItemGroup: a
    .model({
      quantity: a.integer().required(),
      statuses: a.ref('ItemStatus').array(), // for the rare cases where multiple instances of items are sold we use this arrray for tracking.
      itemSku: a.string(),
      item: a.belongsTo('Item', 'itemSku'),
    }),

  ItemCategory: a
    .model({
      lastActivityBy: a.id().required(),
      kind: a.string().required(),
      name: a.string().required(),
      matchNames: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      deletedAt: a.datetime(),
    })
    .identifier(['kind', 'name'])
    .secondaryIndexes((index) => [
      index("matchNames"),
      index("kind"),
    ]),

  Transaction: a
    .model({
      lastActivityBy: a.id().required(),
      type: a.enum(["Sale", "Refund", "Payout", "Reversal"]),
      paymentType: a.enum(["Cash", "Card", "GiftCard", "Account", "Other"]),
      channel: a.string(),
      amount: a.integer().required(),
      time: a.datetime().required(),
      linkedTransaction: a.string(),  // for refund link to sale, or for a reversal link to original
      itemSku: a.string(),
      item: a.belongsTo("Item", "itemSku"),
      accountNumber: a.string(),
      account: a.belongsTo("Account", "accountNumber"),
    })
    .secondaryIndexes((index) => [
      index("type"),
      index("paymentType"),
      index("itemSku"),
      index("accountNumber"),
    ]),

}).authorization(allow => [
  allow.group('Employee'), // default to employee
  allow.resource(postConfirmation),
  allow.resource(createActionFunction),
  allow.resource(importAccountFunction),
  allow.resource(findExternalAccount),
  allow.resource(findExternalItem),
  allow.resource(fetchItemsFunction),
  allow.resource(importItemFunction),
  allow.resource(resetDataFunction),
]);

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  }
});

