import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';
import { createActionFunction } from '../function/create-action/resource';
import { truncateTableFunction } from '../function/truncate-table/resource';

const schema = a.schema({

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
      userId: a.id(),
      createdBy: a.belongsTo('UserProfile', 'userId'),
      before: a.json(),
      after: a.json(),
    })
    .secondaryIndexes((index) => [index("refId")]),

  Comment: a
    .model({
      text: a.string().required(),
      refId: a.id().required(), // Lose coupling for now
      createdAt: a.datetime(),
      userId: a.id(),
      createdBy: a.belongsTo('UserProfile', 'userId'),
      updatedAt: a.datetime(),
    })
    .authorization(allow => [allow.owner(), allow.group('ADMIN'), allow.authenticated().to(['read'])]),

  UserProfile: a
    .model({
      email: a.string().required(),
      profileOwner: a.string(),
      username: a.string(), // the cognito username not for display
      nickname: a.string(), // the display name
      phoneNumber: a.string(),
      status: a.enum(["Active", "Inactive", "Suspended", "Pending"]),
      role: a.enum(["Admin", "Manager", "Employee", "Service", "Guest"]),
      photo: a.url(),

      comments: a.hasMany('Comment', 'userId'),
      actions: a.hasMany('Action', 'userId'),

      settings: a.json().required(),
      deletedAt: a.datetime(),

    })
    .secondaryIndexes((index) => [
      index("username"),
      index("email"),
    ])
    .authorization((allow) => [
      allow.ownerDefinedIn("profileOwner"),
      allow.group('ADMIN')
    ]),

  Employee: a
    .model({
      name: a.string().required(),
      user: a.id(), // profile id can be null
      addressLine1: a.string(),
      addressLine2: a.string(),
      city: a.string(),
      state: a.string(),
      postcode: a.string(),
      status: a.enum(["Normal", "Inactive", "CompetenceCenter", "Provisional", "Partner", "Owner"]),
      startDate: a.date(),
      endDate: a.date(),
    }),


  Account: a
    .model({
      id: a.id(),
      number: a.string().required(),
      userId: a.id(),
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
      kind: a.enum(["Standard", "VIP", "Vender", "Employee"]),
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
      index("deletedAt").sortKeys(["number", "createdAt", "balance"]),
    ]),

  Item: a
    .model({
      id: a.id(),
      sku: a.string().required(),
      lastActivityBy: a.id().required(),
      title: a.string(),
      account: a.belongsTo("Account", "accountNumber"),
      accountNumber: a.string(),
      category: a.string().required(),
      brand: a.string(),
      color: a.string(),
      size: a.string(),
      description: a.string(),
      details: a.string(),
      images: a.url().array(), // fields can be arrays,
      condition: a.enum(['AsNew', 'Good', 'Marked', 'Damaged', 'Unknown']),
      quantity: a.integer().required(),
      split: a.integer().required(),
      price: a.integer().required(),
      status: a.enum(['Tagged', 'HungOut', 'Sold', 'ToDonate', 'Donated', 'Parked', 'Returned', 'Expired', 'Lost', 'Stolen']),
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

  ItemCategory: a
    .model({
      id: a.id().required(),
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
      index("id"),
      index("matchNames"),
      index("kind"),
    ]),

  Transaction: a
    .model({
      lastActivityBy: a.id().required(),
      type: a.enum(["Sale", "Refund", "Payout", "Reversal"]),
      paymentType: a.enum(["Cash", "Card", "GiftCard", "Account", "Other"]),
      amount: a.integer().required(),
      itemSku: a.string(),
      item: a.belongsTo("Item", "itemSku"),
      linkedTransaction: a.id(),  // for refund link to sale, or for a reversal link to original
      accountNumber: a.string(),
      account: a.belongsTo("Account", "accountNumber"),
    })
    .secondaryIndexes((index) => [
      index("type"),
      index("paymentType"),
    ]),

  ImportedObject: a
    .model({
      externalId: a.string().required(),
      type: a.string().required(),
      userId: a.string(),
      data: a.json(),
    })
    .identifier(['externalId'])
    .secondaryIndexes((index) => [
      index("type"),
      index("userId"),
    ]),

  truncateTable: a
    .mutation()
    // arguments that this query accepts
    .arguments({
      tablename: a.string()
    })
    // return type of the query
    .returns(a.string())
    .handler(a.handler.function(truncateTableFunction)),

}).authorization(allow => [
  allow.group('Employee'), // default to employee
  allow.resource(postConfirmation),
  allow.resource(createActionFunction),
  allow.resource(truncateTableFunction),
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

