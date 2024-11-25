import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  // Types
  ActiveFlag: a.enum(['TRUE', 'FALSE']),

  // Models
  Counter: a
    .model({
      type: a.enum(["MODEL_TOTAL", "NUMBER_KEY"]),
      name: a.string().required(),
      count: a.integer().default(0),
      updatedAt: a.datetime(),
      lastSync: a.datetime(),
      refId: a.id(), // Optional, 
    })
    .identifier(['name']),

  Action: a
    .model({
      descriptiopn: a.string().required(),
      actor: a.string(),
      modelName: a.string(),
      refId: a.id(), // Lose coupling for now
      type: a.enum(["CREATE", "READ", "UPDATE", "DELETE", "SEARCH", "IMPORT", "INC", "DEC"]),
      userId: a.id(),
      createdBy: a.belongsTo('User', 'userId'),
      before: a.json(),
      after: a.json(),
    })
    .secondaryIndexes((index) => [index("refId")]),

  Comment: a
    .model({
      text: a.string().required(),
      refId: a.string().required(), // Lose coupling for now
      createdAt: a.datetime(),
      userId: a.id(),
      createdBy: a.belongsTo('User', 'userId'),
      updatedAt: a.datetime(),
    }),

  UserRole: a.enum(["ADMIN", "MANAGER", "EMPLOYEE", "NONE", "SERVICE"]),
  UserStatus: a.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PROVISIONAL"]),
  User: a
    .model({
      username: a.string().required(),
      email: a.string().required(),
      phoneNumber: a.string(),
      status: a.ref("UserStatus").required(),
      role: a.ref("UserRole").required(),
      employeeId: a.id(),
      employee: a.belongsTo('Employee', 'employeeId'),
      comments: a.hasMany('Comment', 'userId'),
      actions: a.hasMany('Action', 'userId'),
      accounts: a.hasMany('Account', 'userId'),
      items: a.hasMany('Item', 'userId'),
      categories: a.hasMany('ItemCategory', 'userId'),
      transactions: a.hasMany('Transaction', 'userId'),
      settings: a.json().required(),
    })
    .secondaryIndexes((index) => [index("email")]),

  Employee: a
    .model({
      name: a.string().required(),
      user: a.hasOne('User', 'employeeId'),
      addressLine1: a.string(),
      addressLine2: a.string(),
      city: a.string(),
      state: a.string(),
      postcode: a.string(),
      status: a.enum(["NORMAL", "INACTIVE", "COMPETENCE_CENTER", "PROVISIONAL", "PARTNER"]),
      startDate: a.date(),
      endDate: a.date(),
    }),

  Account: a
    .model({
      id: a.id().required(),
      number: a.string().required(),
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
      comunicationPreferences: a.enum(["SMS", "EMAIL", "NONE", "ALL"]),
      status: a.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
      kind: a.enum(["VIP", "VENDER", "STANDARD", "EMPLOYEE"]),
      defaultSplit: a.integer(),
      items: a.hasMany("Item", "accountNumber"), // setup relationships between types
      transaction: a.hasMany("Transaction", "accountNumber"), // setup relationships between types
      balance: a.integer().required(),
      noSales: a.integer().required().default(0),
      noItems: a.integer().required().default(0),
      active: a.ref('ActiveFlag').required(),
      userId: a.id().required(),
      createdBy: a.belongsTo('User', 'userId'),
      lastActivityAt: a.datetime().required(),
      lastItemAt: a.datetime(),
      lastSettlementAt: a.datetime(),
      tags: a.string().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(['number'])
    .secondaryIndexes((index) => [
      index("id"),
      index("active").sortKeys(["number", "createdAt", "balance"]),
    ]),

  Item: a
    .model({
      id: a.id().required(),
      sku: a.string().required(),
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
      condition: a.enum(['AS_NEW', 'GOOD', 'MARKED', 'DAMAGED', 'UNKNOWN']),
      quantity: a.integer().required(),
      split: a.integer().required(),
      price: a.integer().required(),
      status: a.enum(['TAGGED', 'HUNG_OUT', 'SOLD', 'TO_DONATE', 'DONATED', 'PARKED', 'RETURNED', 'EXPIRED', 'LOST', 'STOLEN']),
      transaction: a.hasMany("Transaction", "itemSku"), // setup relationships between types
      active: a.ref('ActiveFlag').required(),
      printedAt: a.datetime(),
      lastSoldAt: a.datetime(),
      lastViewedAt: a.datetime(),
      userId: a.id(),
      createdBy: a.belongsTo('User', 'userId'),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(['sku'])
    .secondaryIndexes((index) => [
      index("id"),
      index("accountNumber"),
      index("category"),
      index("brand"),
      index("color"),
      index("size"),
      index("description")
    ]),

  ItemCategory: a
    .model({
      id: a.id().required(),
      kind: a.string().required(),
      name: a.string().required(),
      matchNames: a.string().required(),
      active: a.ref('ActiveFlag').required(),
      userId: a.id(),
      createdBy: a.belongsTo('User', 'userId'),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(['kind', 'name'])
    .secondaryIndexes((index) => [
      index("id"),
      index("matchNames"),
      index("kind"),
    ]),

  Transaction: a
    .model({
      type: a.enum(["SALE", "REFUND", "PAYOUT"]),
      paymentType: a.enum(["CASH", "CARD", "GIFTCARD", "ACCOUNT", "OTHER"]),
      amount: a.integer().required(),
      itemSku: a.string(),
      item: a.belongsTo("Item", "itemSku"),
      linkedTransaction: a.id(),  // for refund link to sale
      accountNumber: a.string(),
      account: a.belongsTo("Account", "accountNumber"),
      userId: a.id(),
      createdBy: a.belongsTo('User', 'userId'),
    })
    .secondaryIndexes((index) => [
      index("type"),
      index("paymentType"),
    ]),

}).authorization((allow) => [allow.authenticated()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
