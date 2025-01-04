/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAccount = /* GraphQL */ `
  mutation CreateAccount(
    $condition: ModelAccountConditionInput
    $input: CreateAccountInput!
  ) {
    createAccount(condition: $condition, input: $input) {
      addressLine1
      addressLine2
      balance
      city
      comunicationPreferences
      createdAt
      defaultSplit
      deletedAt
      email
      firstName
      id
      isMobile
      items {
        nextToken
        __typename
      }
      kind
      lastActivityAt
      lastActivityBy
      lastItemAt
      lastName
      lastSettlementAt
      noItems
      noSales
      number
      phoneNumber
      postcode
      state
      status
      tags
      transactions {
        nextToken
        __typename
      }
      updatedAt
      userId
      __typename
    }
  }
`;
export const createAction = /* GraphQL */ `
  mutation CreateAction(
    $condition: ModelActionConditionInput
    $input: CreateActionInput!
  ) {
    createAction(condition: $condition, input: $input) {
      actor
      after
      before
      createdAt
      createdBy {
        createdAt
        deletedAt
        email
        id
        nickname
        phoneNumber
        photo
        profileOwner
        role
        settings
        status
        updatedAt
        username
        __typename
      }
      description
      id
      modelName
      refId
      type
      updatedAt
      userId
      __typename
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $condition: ModelCommentConditionInput
    $input: CreateCommentInput!
  ) {
    createComment(condition: $condition, input: $input) {
      createdAt
      createdBy {
        createdAt
        deletedAt
        email
        id
        nickname
        phoneNumber
        photo
        profileOwner
        role
        settings
        status
        updatedAt
        username
        __typename
      }
      id
      owner
      refId
      text
      updatedAt
      userId
      __typename
    }
  }
`;
export const createCounter = /* GraphQL */ `
  mutation CreateCounter(
    $condition: ModelCounterConditionInput
    $input: CreateCounterInput!
  ) {
    createCounter(condition: $condition, input: $input) {
      createdAt
      name
      updatedAt
      val
      __typename
    }
  }
`;
export const createEmployee = /* GraphQL */ `
  mutation CreateEmployee(
    $condition: ModelEmployeeConditionInput
    $input: CreateEmployeeInput!
  ) {
    createEmployee(condition: $condition, input: $input) {
      addressLine1
      addressLine2
      city
      createdAt
      endDate
      id
      name
      postcode
      startDate
      state
      status
      updatedAt
      user
      __typename
    }
  }
`;
export const createImportedObject = /* GraphQL */ `
  mutation CreateImportedObject(
    $condition: ModelImportedObjectConditionInput
    $input: CreateImportedObjectInput!
  ) {
    createImportedObject(condition: $condition, input: $input) {
      createdAt
      data
      externalId
      type
      updatedAt
      userId
      __typename
    }
  }
`;
export const createItem = /* GraphQL */ `
  mutation CreateItem(
    $condition: ModelItemConditionInput
    $input: CreateItemInput!
  ) {
    createItem(condition: $condition, input: $input) {
      account {
        addressLine1
        addressLine2
        balance
        city
        comunicationPreferences
        createdAt
        defaultSplit
        deletedAt
        email
        firstName
        id
        isMobile
        kind
        lastActivityAt
        lastActivityBy
        lastItemAt
        lastName
        lastSettlementAt
        noItems
        noSales
        number
        phoneNumber
        postcode
        state
        status
        tags
        updatedAt
        userId
        __typename
      }
      accountNumber
      brand
      category
      color
      condition
      createdAt
      deletedAt
      description
      details
      id
      images
      lastActivityBy
      lastSoldAt
      lastViewedAt
      price
      printedAt
      quantity
      size
      sku
      split
      status
      title
      transactions {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const createItemCategory = /* GraphQL */ `
  mutation CreateItemCategory(
    $condition: ModelItemCategoryConditionInput
    $input: CreateItemCategoryInput!
  ) {
    createItemCategory(condition: $condition, input: $input) {
      createdAt
      deletedAt
      id
      kind
      lastActivityBy
      matchNames
      name
      updatedAt
      __typename
    }
  }
`;
export const createSyncData = /* GraphQL */ `
  mutation CreateSyncData(
    $condition: ModelSyncDataConditionInput
    $input: CreateSyncDataInput!
  ) {
    createSyncData(condition: $condition, input: $input) {
      createdAt
      history {
        failed
        processed
        recieved
        syncTime
        __typename
      }
      id
      interface
      lastSync
      log {
        failed
        processed
        recieved
        syncTime
        __typename
      }
      parameters {
        expands
        includes
        path
        __typename
      }
      total
      updatedAt
      __typename
    }
  }
`;
export const createTransaction = /* GraphQL */ `
  mutation CreateTransaction(
    $condition: ModelTransactionConditionInput
    $input: CreateTransactionInput!
  ) {
    createTransaction(condition: $condition, input: $input) {
      account {
        addressLine1
        addressLine2
        balance
        city
        comunicationPreferences
        createdAt
        defaultSplit
        deletedAt
        email
        firstName
        id
        isMobile
        kind
        lastActivityAt
        lastActivityBy
        lastItemAt
        lastName
        lastSettlementAt
        noItems
        noSales
        number
        phoneNumber
        postcode
        state
        status
        tags
        updatedAt
        userId
        __typename
      }
      accountNumber
      amount
      createdAt
      id
      item {
        accountNumber
        brand
        category
        color
        condition
        createdAt
        deletedAt
        description
        details
        id
        images
        lastActivityBy
        lastSoldAt
        lastViewedAt
        price
        printedAt
        quantity
        size
        sku
        split
        status
        title
        updatedAt
        __typename
      }
      itemSku
      lastActivityBy
      linkedTransaction
      paymentType
      type
      updatedAt
      __typename
    }
  }
`;
export const createUserProfile = /* GraphQL */ `
  mutation CreateUserProfile(
    $condition: ModelUserProfileConditionInput
    $input: CreateUserProfileInput!
  ) {
    createUserProfile(condition: $condition, input: $input) {
      actions {
        nextToken
        __typename
      }
      comments {
        nextToken
        __typename
      }
      createdAt
      deletedAt
      email
      id
      nickname
      phoneNumber
      photo
      profileOwner
      role
      settings
      status
      updatedAt
      username
      __typename
    }
  }
`;
export const deleteAccount = /* GraphQL */ `
  mutation DeleteAccount(
    $condition: ModelAccountConditionInput
    $input: DeleteAccountInput!
  ) {
    deleteAccount(condition: $condition, input: $input) {
      addressLine1
      addressLine2
      balance
      city
      comunicationPreferences
      createdAt
      defaultSplit
      deletedAt
      email
      firstName
      id
      isMobile
      items {
        nextToken
        __typename
      }
      kind
      lastActivityAt
      lastActivityBy
      lastItemAt
      lastName
      lastSettlementAt
      noItems
      noSales
      number
      phoneNumber
      postcode
      state
      status
      tags
      transactions {
        nextToken
        __typename
      }
      updatedAt
      userId
      __typename
    }
  }
`;
export const deleteAction = /* GraphQL */ `
  mutation DeleteAction(
    $condition: ModelActionConditionInput
    $input: DeleteActionInput!
  ) {
    deleteAction(condition: $condition, input: $input) {
      actor
      after
      before
      createdAt
      createdBy {
        createdAt
        deletedAt
        email
        id
        nickname
        phoneNumber
        photo
        profileOwner
        role
        settings
        status
        updatedAt
        username
        __typename
      }
      description
      id
      modelName
      refId
      type
      updatedAt
      userId
      __typename
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $condition: ModelCommentConditionInput
    $input: DeleteCommentInput!
  ) {
    deleteComment(condition: $condition, input: $input) {
      createdAt
      createdBy {
        createdAt
        deletedAt
        email
        id
        nickname
        phoneNumber
        photo
        profileOwner
        role
        settings
        status
        updatedAt
        username
        __typename
      }
      id
      owner
      refId
      text
      updatedAt
      userId
      __typename
    }
  }
`;
export const deleteCounter = /* GraphQL */ `
  mutation DeleteCounter(
    $condition: ModelCounterConditionInput
    $input: DeleteCounterInput!
  ) {
    deleteCounter(condition: $condition, input: $input) {
      createdAt
      name
      updatedAt
      val
      __typename
    }
  }
`;
export const deleteEmployee = /* GraphQL */ `
  mutation DeleteEmployee(
    $condition: ModelEmployeeConditionInput
    $input: DeleteEmployeeInput!
  ) {
    deleteEmployee(condition: $condition, input: $input) {
      addressLine1
      addressLine2
      city
      createdAt
      endDate
      id
      name
      postcode
      startDate
      state
      status
      updatedAt
      user
      __typename
    }
  }
`;
export const deleteImportedObject = /* GraphQL */ `
  mutation DeleteImportedObject(
    $condition: ModelImportedObjectConditionInput
    $input: DeleteImportedObjectInput!
  ) {
    deleteImportedObject(condition: $condition, input: $input) {
      createdAt
      data
      externalId
      type
      updatedAt
      userId
      __typename
    }
  }
`;
export const deleteItem = /* GraphQL */ `
  mutation DeleteItem(
    $condition: ModelItemConditionInput
    $input: DeleteItemInput!
  ) {
    deleteItem(condition: $condition, input: $input) {
      account {
        addressLine1
        addressLine2
        balance
        city
        comunicationPreferences
        createdAt
        defaultSplit
        deletedAt
        email
        firstName
        id
        isMobile
        kind
        lastActivityAt
        lastActivityBy
        lastItemAt
        lastName
        lastSettlementAt
        noItems
        noSales
        number
        phoneNumber
        postcode
        state
        status
        tags
        updatedAt
        userId
        __typename
      }
      accountNumber
      brand
      category
      color
      condition
      createdAt
      deletedAt
      description
      details
      id
      images
      lastActivityBy
      lastSoldAt
      lastViewedAt
      price
      printedAt
      quantity
      size
      sku
      split
      status
      title
      transactions {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const deleteItemCategory = /* GraphQL */ `
  mutation DeleteItemCategory(
    $condition: ModelItemCategoryConditionInput
    $input: DeleteItemCategoryInput!
  ) {
    deleteItemCategory(condition: $condition, input: $input) {
      createdAt
      deletedAt
      id
      kind
      lastActivityBy
      matchNames
      name
      updatedAt
      __typename
    }
  }
`;
export const deleteSyncData = /* GraphQL */ `
  mutation DeleteSyncData(
    $condition: ModelSyncDataConditionInput
    $input: DeleteSyncDataInput!
  ) {
    deleteSyncData(condition: $condition, input: $input) {
      createdAt
      history {
        failed
        processed
        recieved
        syncTime
        __typename
      }
      id
      interface
      lastSync
      log {
        failed
        processed
        recieved
        syncTime
        __typename
      }
      parameters {
        expands
        includes
        path
        __typename
      }
      total
      updatedAt
      __typename
    }
  }
`;
export const deleteTransaction = /* GraphQL */ `
  mutation DeleteTransaction(
    $condition: ModelTransactionConditionInput
    $input: DeleteTransactionInput!
  ) {
    deleteTransaction(condition: $condition, input: $input) {
      account {
        addressLine1
        addressLine2
        balance
        city
        comunicationPreferences
        createdAt
        defaultSplit
        deletedAt
        email
        firstName
        id
        isMobile
        kind
        lastActivityAt
        lastActivityBy
        lastItemAt
        lastName
        lastSettlementAt
        noItems
        noSales
        number
        phoneNumber
        postcode
        state
        status
        tags
        updatedAt
        userId
        __typename
      }
      accountNumber
      amount
      createdAt
      id
      item {
        accountNumber
        brand
        category
        color
        condition
        createdAt
        deletedAt
        description
        details
        id
        images
        lastActivityBy
        lastSoldAt
        lastViewedAt
        price
        printedAt
        quantity
        size
        sku
        split
        status
        title
        updatedAt
        __typename
      }
      itemSku
      lastActivityBy
      linkedTransaction
      paymentType
      type
      updatedAt
      __typename
    }
  }
`;
export const deleteUserProfile = /* GraphQL */ `
  mutation DeleteUserProfile(
    $condition: ModelUserProfileConditionInput
    $input: DeleteUserProfileInput!
  ) {
    deleteUserProfile(condition: $condition, input: $input) {
      actions {
        nextToken
        __typename
      }
      comments {
        nextToken
        __typename
      }
      createdAt
      deletedAt
      email
      id
      nickname
      phoneNumber
      photo
      profileOwner
      role
      settings
      status
      updatedAt
      username
      __typename
    }
  }
`;
export const incCounter = /* GraphQL */ `
  mutation IncCounter($name: String) {
    incCounter(name: $name) {
      createdAt
      name
      updatedAt
      val
      __typename
    }
  }
`;
export const truncateTable = /* GraphQL */ `
  mutation TruncateTable($tablename: String) {
    truncateTable(tablename: $tablename)
  }
`;
export const updateAccount = /* GraphQL */ `
  mutation UpdateAccount(
    $condition: ModelAccountConditionInput
    $input: UpdateAccountInput!
  ) {
    updateAccount(condition: $condition, input: $input) {
      addressLine1
      addressLine2
      balance
      city
      comunicationPreferences
      createdAt
      defaultSplit
      deletedAt
      email
      firstName
      id
      isMobile
      items {
        nextToken
        __typename
      }
      kind
      lastActivityAt
      lastActivityBy
      lastItemAt
      lastName
      lastSettlementAt
      noItems
      noSales
      number
      phoneNumber
      postcode
      state
      status
      tags
      transactions {
        nextToken
        __typename
      }
      updatedAt
      userId
      __typename
    }
  }
`;
export const updateAction = /* GraphQL */ `
  mutation UpdateAction(
    $condition: ModelActionConditionInput
    $input: UpdateActionInput!
  ) {
    updateAction(condition: $condition, input: $input) {
      actor
      after
      before
      createdAt
      createdBy {
        createdAt
        deletedAt
        email
        id
        nickname
        phoneNumber
        photo
        profileOwner
        role
        settings
        status
        updatedAt
        username
        __typename
      }
      description
      id
      modelName
      refId
      type
      updatedAt
      userId
      __typename
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $condition: ModelCommentConditionInput
    $input: UpdateCommentInput!
  ) {
    updateComment(condition: $condition, input: $input) {
      createdAt
      createdBy {
        createdAt
        deletedAt
        email
        id
        nickname
        phoneNumber
        photo
        profileOwner
        role
        settings
        status
        updatedAt
        username
        __typename
      }
      id
      owner
      refId
      text
      updatedAt
      userId
      __typename
    }
  }
`;
export const updateCounter = /* GraphQL */ `
  mutation UpdateCounter(
    $condition: ModelCounterConditionInput
    $input: UpdateCounterInput!
  ) {
    updateCounter(condition: $condition, input: $input) {
      createdAt
      name
      updatedAt
      val
      __typename
    }
  }
`;
export const updateEmployee = /* GraphQL */ `
  mutation UpdateEmployee(
    $condition: ModelEmployeeConditionInput
    $input: UpdateEmployeeInput!
  ) {
    updateEmployee(condition: $condition, input: $input) {
      addressLine1
      addressLine2
      city
      createdAt
      endDate
      id
      name
      postcode
      startDate
      state
      status
      updatedAt
      user
      __typename
    }
  }
`;
export const updateImportedObject = /* GraphQL */ `
  mutation UpdateImportedObject(
    $condition: ModelImportedObjectConditionInput
    $input: UpdateImportedObjectInput!
  ) {
    updateImportedObject(condition: $condition, input: $input) {
      createdAt
      data
      externalId
      type
      updatedAt
      userId
      __typename
    }
  }
`;
export const updateItem = /* GraphQL */ `
  mutation UpdateItem(
    $condition: ModelItemConditionInput
    $input: UpdateItemInput!
  ) {
    updateItem(condition: $condition, input: $input) {
      account {
        addressLine1
        addressLine2
        balance
        city
        comunicationPreferences
        createdAt
        defaultSplit
        deletedAt
        email
        firstName
        id
        isMobile
        kind
        lastActivityAt
        lastActivityBy
        lastItemAt
        lastName
        lastSettlementAt
        noItems
        noSales
        number
        phoneNumber
        postcode
        state
        status
        tags
        updatedAt
        userId
        __typename
      }
      accountNumber
      brand
      category
      color
      condition
      createdAt
      deletedAt
      description
      details
      id
      images
      lastActivityBy
      lastSoldAt
      lastViewedAt
      price
      printedAt
      quantity
      size
      sku
      split
      status
      title
      transactions {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const updateItemCategory = /* GraphQL */ `
  mutation UpdateItemCategory(
    $condition: ModelItemCategoryConditionInput
    $input: UpdateItemCategoryInput!
  ) {
    updateItemCategory(condition: $condition, input: $input) {
      createdAt
      deletedAt
      id
      kind
      lastActivityBy
      matchNames
      name
      updatedAt
      __typename
    }
  }
`;
export const updateSyncData = /* GraphQL */ `
  mutation UpdateSyncData(
    $condition: ModelSyncDataConditionInput
    $input: UpdateSyncDataInput!
  ) {
    updateSyncData(condition: $condition, input: $input) {
      createdAt
      history {
        failed
        processed
        recieved
        syncTime
        __typename
      }
      id
      interface
      lastSync
      log {
        failed
        processed
        recieved
        syncTime
        __typename
      }
      parameters {
        expands
        includes
        path
        __typename
      }
      total
      updatedAt
      __typename
    }
  }
`;
export const updateTransaction = /* GraphQL */ `
  mutation UpdateTransaction(
    $condition: ModelTransactionConditionInput
    $input: UpdateTransactionInput!
  ) {
    updateTransaction(condition: $condition, input: $input) {
      account {
        addressLine1
        addressLine2
        balance
        city
        comunicationPreferences
        createdAt
        defaultSplit
        deletedAt
        email
        firstName
        id
        isMobile
        kind
        lastActivityAt
        lastActivityBy
        lastItemAt
        lastName
        lastSettlementAt
        noItems
        noSales
        number
        phoneNumber
        postcode
        state
        status
        tags
        updatedAt
        userId
        __typename
      }
      accountNumber
      amount
      createdAt
      id
      item {
        accountNumber
        brand
        category
        color
        condition
        createdAt
        deletedAt
        description
        details
        id
        images
        lastActivityBy
        lastSoldAt
        lastViewedAt
        price
        printedAt
        quantity
        size
        sku
        split
        status
        title
        updatedAt
        __typename
      }
      itemSku
      lastActivityBy
      linkedTransaction
      paymentType
      type
      updatedAt
      __typename
    }
  }
`;
export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile(
    $condition: ModelUserProfileConditionInput
    $input: UpdateUserProfileInput!
  ) {
    updateUserProfile(condition: $condition, input: $input) {
      actions {
        nextToken
        __typename
      }
      comments {
        nextToken
        __typename
      }
      createdAt
      deletedAt
      email
      id
      nickname
      phoneNumber
      photo
      profileOwner
      role
      settings
      status
      updatedAt
      username
      __typename
    }
  }
`;
