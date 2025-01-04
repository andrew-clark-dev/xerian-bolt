/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAccount = /* GraphQL */ `
  query GetAccount($number: String!) {
    getAccount(number: $number) {
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
export const getAction = /* GraphQL */ `
  query GetAction($id: ID!) {
    getAction(id: $id) {
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
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
export const getCounter = /* GraphQL */ `
  query GetCounter($name: String!) {
    getCounter(name: $name) {
      createdAt
      name
      updatedAt
      val
      __typename
    }
  }
`;
export const getEmployee = /* GraphQL */ `
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
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
export const getImportedObject = /* GraphQL */ `
  query GetImportedObject($externalId: String!) {
    getImportedObject(externalId: $externalId) {
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
export const getItem = /* GraphQL */ `
  query GetItem($sku: String!) {
    getItem(sku: $sku) {
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
export const getItemCategory = /* GraphQL */ `
  query GetItemCategory($kind: String!, $name: String!) {
    getItemCategory(kind: $kind, name: $name) {
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
export const getSyncData = /* GraphQL */ `
  query GetSyncData($id: ID!) {
    getSyncData(id: $id) {
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
export const getTransaction = /* GraphQL */ `
  query GetTransaction($id: ID!) {
    getTransaction(id: $id) {
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
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
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
export const listAccountByDeletedAtAndNumberAndCreatedAtAndBalance = /* GraphQL */ `
  query ListAccountByDeletedAtAndNumberAndCreatedAtAndBalance(
    $deletedAt: AWSDateTime!
    $filter: ModelAccountFilterInput
    $limit: Int
    $nextToken: String
    $numberCreatedAtBalance: ModelAccountAccountsByDeletedAtAndNumberAndCreatedAtAndBalanceCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
  ) {
    listAccountByDeletedAtAndNumberAndCreatedAtAndBalance(
      deletedAt: $deletedAt
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      numberCreatedAtBalance: $numberCreatedAtBalance
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listAccountById = /* GraphQL */ `
  query ListAccountById(
    $filter: ModelAccountFilterInput
    $id: ID!
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAccountById(
      filter: $filter
      id: $id
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listAccounts = /* GraphQL */ `
  query ListAccounts(
    $filter: ModelAccountFilterInput
    $limit: Int
    $nextToken: String
    $number: String
    $sortDirection: ModelSortDirection
  ) {
    listAccounts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      number: $number
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listActionByRefId = /* GraphQL */ `
  query ListActionByRefId(
    $filter: ModelActionFilterInput
    $limit: Int
    $nextToken: String
    $refId: ID!
    $sortDirection: ModelSortDirection
  ) {
    listActionByRefId(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      refId: $refId
      sortDirection: $sortDirection
    ) {
      items {
        actor
        after
        before
        createdAt
        description
        id
        modelName
        refId
        type
        updatedAt
        userId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listActions = /* GraphQL */ `
  query ListActions(
    $filter: ModelActionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listActions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        actor
        after
        before
        createdAt
        description
        id
        modelName
        refId
        type
        updatedAt
        userId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        id
        owner
        refId
        text
        updatedAt
        userId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listCounters = /* GraphQL */ `
  query ListCounters(
    $filter: ModelCounterFilterInput
    $limit: Int
    $name: String
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCounters(
      filter: $filter
      limit: $limit
      name: $name
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        createdAt
        name
        updatedAt
        val
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listEmployees = /* GraphQL */ `
  query ListEmployees(
    $filter: ModelEmployeeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEmployees(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listImportedObjectByType = /* GraphQL */ `
  query ListImportedObjectByType(
    $filter: ModelImportedObjectFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
    $type: String!
  ) {
    listImportedObjectByType(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
      type: $type
    ) {
      items {
        createdAt
        data
        externalId
        type
        updatedAt
        userId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listImportedObjectByUserId = /* GraphQL */ `
  query ListImportedObjectByUserId(
    $filter: ModelImportedObjectFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
    $userId: String!
  ) {
    listImportedObjectByUserId(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
      userId: $userId
    ) {
      items {
        createdAt
        data
        externalId
        type
        updatedAt
        userId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listImportedObjects = /* GraphQL */ `
  query ListImportedObjects(
    $externalId: String
    $filter: ModelImportedObjectFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listImportedObjects(
      externalId: $externalId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        createdAt
        data
        externalId
        type
        updatedAt
        userId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listItemByDeletedAtAndAccountNumberAndCategoryAndBrandAndColorAndSize = /* GraphQL */ `
  query ListItemByDeletedAtAndAccountNumberAndCategoryAndBrandAndColorAndSize(
    $accountNumberCategoryBrandColorSize: ModelItemItemsByDeletedAtAndAccountNumberAndCategoryAndBrandAndColorAndSizeCompositeKeyConditionInput
    $deletedAt: AWSDateTime!
    $filter: ModelItemFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listItemByDeletedAtAndAccountNumberAndCategoryAndBrandAndColorAndSize(
      accountNumberCategoryBrandColorSize: $accountNumberCategoryBrandColorSize
      deletedAt: $deletedAt
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listItemById = /* GraphQL */ `
  query ListItemById(
    $filter: ModelItemFilterInput
    $id: ID!
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listItemById(
      filter: $filter
      id: $id
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listItemCategories = /* GraphQL */ `
  query ListItemCategories(
    $filter: ModelItemCategoryFilterInput
    $kind: String
    $limit: Int
    $name: ModelStringKeyConditionInput
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listItemCategories(
      filter: $filter
      kind: $kind
      limit: $limit
      name: $name
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listItemCategoryById = /* GraphQL */ `
  query ListItemCategoryById(
    $filter: ModelItemCategoryFilterInput
    $id: ID!
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listItemCategoryById(
      filter: $filter
      id: $id
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listItemCategoryByKind = /* GraphQL */ `
  query ListItemCategoryByKind(
    $filter: ModelItemCategoryFilterInput
    $kind: String!
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listItemCategoryByKind(
      filter: $filter
      kind: $kind
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listItemCategoryByMatchNames = /* GraphQL */ `
  query ListItemCategoryByMatchNames(
    $filter: ModelItemCategoryFilterInput
    $limit: Int
    $matchNames: String!
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listItemCategoryByMatchNames(
      filter: $filter
      limit: $limit
      matchNames: $matchNames
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listItems = /* GraphQL */ `
  query ListItems(
    $filter: ModelItemFilterInput
    $limit: Int
    $nextToken: String
    $sku: String
    $sortDirection: ModelSortDirection
  ) {
    listItems(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sku: $sku
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listSyncData = /* GraphQL */ `
  query ListSyncData(
    $filter: ModelSyncDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSyncData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        id
        interface
        lastSync
        total
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listTransactionByPaymentType = /* GraphQL */ `
  query ListTransactionByPaymentType(
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
    $paymentType: TransactionPaymentType!
    $sortDirection: ModelSortDirection
  ) {
    listTransactionByPaymentType(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      paymentType: $paymentType
      sortDirection: $sortDirection
    ) {
      items {
        accountNumber
        amount
        createdAt
        id
        itemSku
        lastActivityBy
        linkedTransaction
        paymentType
        type
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listTransactionByType = /* GraphQL */ `
  query ListTransactionByType(
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
    $type: TransactionType!
  ) {
    listTransactionByType(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
      type: $type
    ) {
      items {
        accountNumber
        amount
        createdAt
        id
        itemSku
        lastActivityBy
        linkedTransaction
        paymentType
        type
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listTransactions = /* GraphQL */ `
  query ListTransactions(
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        accountNumber
        amount
        createdAt
        id
        itemSku
        lastActivityBy
        linkedTransaction
        paymentType
        type
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listUserProfileByEmail = /* GraphQL */ `
  query ListUserProfileByEmail(
    $email: String!
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserProfileByEmail(
      email: $email
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listUserProfileByUsername = /* GraphQL */ `
  query ListUserProfileByUsername(
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
    $username: String!
  ) {
    listUserProfileByUsername(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
      username: $username
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
