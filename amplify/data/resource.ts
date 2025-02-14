import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';
import { createActionFunction } from '../function/create-action/resource';
import { findExternalAccount } from './external-account/resource';
import { findExternalItem } from './external-item/resource';

import { resetDataFunction } from '../function/reset-data/resource';
import { importAccountFunction, importItemFunction, importSaleFunction } from './import/resource';

export const schema = a.schema({

  // Models
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
    .secondaryIndexes((index) => [index("refId"), index("userId"), index("typeIndex"), index("modelName")]),

  Comment: a
    .model({
      text: a.string().required(),
      refId: a.id().required(), // Lose coupling for now
      createdAt: a.datetime(),
      userId: a.id(),
      createdBy: a.belongsTo('UserProfile', 'userId'),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((index) => [index("refId"), index("userId")])
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
      index("nickname"),
      index("email"),
    ])
    .authorization((allow) => [
      allow.ownerDefinedIn("profileOwner"),
      allow.group('Admin')
    ]),

  Customer: a
    .model({
      email: a.email().required(),
      name: a.string(),
      sales: a.string().array(), // Sales ids
    })
    .secondaryIndexes((index) => [
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
      transactions: a.string().array(), // this is the list of transaction ids that this item has been involved in.
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

  ItemStatus: a.enum(['Created', 'Tagged', 'Active', 'Sold', 'ToDonate', 'Donated', 'Parked', 'Returned', 'Expired', 'Lost', 'Stolen', 'Multi', 'Unknown']),

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
      sales: a.hasMany('SaleItem', 'itemSku'),
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
      index("createdAt"),
      index("category"),
      index("brand"),
      index("color"),
      index("size"),
      index("status"),
    ]),

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


  Sale: a
    .model({
      id: a.id().required(),
      number: a.string().required(),
      lastActivityBy: a.id().required(),
      customerEmail: a.string(),
      accountNumber: a.string(), // the account number of the customer if exists     
      status: a.enum(['Pending', 'Finalized', 'Parked', 'Voided']),
      discount: a.customType({
        label: a.string().required(),
        value: a.integer().required(),
      }),
      gross: a.integer().required(),
      subTotal: a.integer().required(),
      total: a.integer().required(),
      tax: a.integer().required(), // we only track MWST
      change: a.integer(),
      refund: a.integer(),
      accountTotal: a.integer().required(),
      storeTotal: a.integer().required(),
      transaction: a.string().required(), // tranction id
      items: a.hasMany('SaleItem', 'saleNumber'),
      refundedSale: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(['number'])
    .secondaryIndexes((index) => [
      index("transaction"),
      index("refundedSale"),
    ]),


  SaleItem: a
    .model({
      itemSku: a.string().required(),
      saleNumber: a.string().required(),
      item: a.belongsTo('Item', 'itemSku'),
      tag: a.belongsTo('Sale', 'saleNumber'),
    }),

  Transaction: a
    .model({
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      lastActivityBy: a.id().required(),
      paymentType: a.enum(["Cash", "Card", "GiftCard", "StoreCredit", "Other"]),
      type: a.enum(["Sale", "Refund", "Payout", "Reversal", "TransferIn", "TransferOut"]),
      amount: a.integer().required(),
      tax: a.integer().required(),
      status: a.enum(['Pending', 'Completed', 'Failed']),
      linked: a.string(),  // not currently used

    })
    .secondaryIndexes((index) => [
      index("type"),
    ]),


  findExternalAccount: a.query().arguments({ query: a.string().required() }).returns(a.ref('Account'))
    .handler(a.handler.function(findExternalAccount)),

  findExternalItem: a.query().arguments({ query: a.string().required() }).returns(a.ref('Item'))
    .handler(a.handler.function(findExternalItem)),

}).authorization(allow => [
  allow.group('Employee'), // default to employee
  allow.resource(postConfirmation),
  allow.resource(createActionFunction),
  allow.resource(findExternalAccount),
  allow.resource(findExternalItem),
  allow.resource(resetDataFunction),
  allow.resource(importAccountFunction),
  allow.resource(importItemFunction),
  allow.resource(importSaleFunction),
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

