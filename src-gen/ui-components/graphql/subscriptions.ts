/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccount = /* GraphQL */ `
  subscription OnCreateAccount($filter: ModelSubscriptionAccountFilterInput) {
    onCreateAccount(filter: $filter) {
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
export const onCreateAction = /* GraphQL */ `
  subscription OnCreateAction($filter: ModelSubscriptionActionFilterInput) {
    onCreateAction(filter: $filter) {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onCreateComment(filter: $filter, owner: $owner) {
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
export const onCreateCounter = /* GraphQL */ `
  subscription OnCreateCounter($filter: ModelSubscriptionCounterFilterInput) {
    onCreateCounter(filter: $filter) {
      createdAt
      name
      updatedAt
      val
      __typename
    }
  }
`;
export const onCreateEmployee = /* GraphQL */ `
  subscription OnCreateEmployee($filter: ModelSubscriptionEmployeeFilterInput) {
    onCreateEmployee(filter: $filter) {
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
export const onCreateImportedObject = /* GraphQL */ `
  subscription OnCreateImportedObject(
    $filter: ModelSubscriptionImportedObjectFilterInput
  ) {
    onCreateImportedObject(filter: $filter) {
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
export const onCreateItem = /* GraphQL */ `
  subscription OnCreateItem($filter: ModelSubscriptionItemFilterInput) {
    onCreateItem(filter: $filter) {
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
export const onCreateItemCategory = /* GraphQL */ `
  subscription OnCreateItemCategory(
    $filter: ModelSubscriptionItemCategoryFilterInput
  ) {
    onCreateItemCategory(filter: $filter) {
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
export const onCreateSyncData = /* GraphQL */ `
  subscription OnCreateSyncData($filter: ModelSubscriptionSyncDataFilterInput) {
    onCreateSyncData(filter: $filter) {
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
export const onCreateTransaction = /* GraphQL */ `
  subscription OnCreateTransaction(
    $filter: ModelSubscriptionTransactionFilterInput
  ) {
    onCreateTransaction(filter: $filter) {
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
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $profileOwner: String
  ) {
    onCreateUserProfile(filter: $filter, profileOwner: $profileOwner) {
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
export const onDeleteAccount = /* GraphQL */ `
  subscription OnDeleteAccount($filter: ModelSubscriptionAccountFilterInput) {
    onDeleteAccount(filter: $filter) {
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
export const onDeleteAction = /* GraphQL */ `
  subscription OnDeleteAction($filter: ModelSubscriptionActionFilterInput) {
    onDeleteAction(filter: $filter) {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onDeleteComment(filter: $filter, owner: $owner) {
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
export const onDeleteCounter = /* GraphQL */ `
  subscription OnDeleteCounter($filter: ModelSubscriptionCounterFilterInput) {
    onDeleteCounter(filter: $filter) {
      createdAt
      name
      updatedAt
      val
      __typename
    }
  }
`;
export const onDeleteEmployee = /* GraphQL */ `
  subscription OnDeleteEmployee($filter: ModelSubscriptionEmployeeFilterInput) {
    onDeleteEmployee(filter: $filter) {
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
export const onDeleteImportedObject = /* GraphQL */ `
  subscription OnDeleteImportedObject(
    $filter: ModelSubscriptionImportedObjectFilterInput
  ) {
    onDeleteImportedObject(filter: $filter) {
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
export const onDeleteItem = /* GraphQL */ `
  subscription OnDeleteItem($filter: ModelSubscriptionItemFilterInput) {
    onDeleteItem(filter: $filter) {
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
export const onDeleteItemCategory = /* GraphQL */ `
  subscription OnDeleteItemCategory(
    $filter: ModelSubscriptionItemCategoryFilterInput
  ) {
    onDeleteItemCategory(filter: $filter) {
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
export const onDeleteSyncData = /* GraphQL */ `
  subscription OnDeleteSyncData($filter: ModelSubscriptionSyncDataFilterInput) {
    onDeleteSyncData(filter: $filter) {
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
export const onDeleteTransaction = /* GraphQL */ `
  subscription OnDeleteTransaction(
    $filter: ModelSubscriptionTransactionFilterInput
  ) {
    onDeleteTransaction(filter: $filter) {
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
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $profileOwner: String
  ) {
    onDeleteUserProfile(filter: $filter, profileOwner: $profileOwner) {
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
export const onUpdateAccount = /* GraphQL */ `
  subscription OnUpdateAccount($filter: ModelSubscriptionAccountFilterInput) {
    onUpdateAccount(filter: $filter) {
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
export const onUpdateAction = /* GraphQL */ `
  subscription OnUpdateAction($filter: ModelSubscriptionActionFilterInput) {
    onUpdateAction(filter: $filter) {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onUpdateComment(filter: $filter, owner: $owner) {
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
export const onUpdateCounter = /* GraphQL */ `
  subscription OnUpdateCounter($filter: ModelSubscriptionCounterFilterInput) {
    onUpdateCounter(filter: $filter) {
      createdAt
      name
      updatedAt
      val
      __typename
    }
  }
`;
export const onUpdateEmployee = /* GraphQL */ `
  subscription OnUpdateEmployee($filter: ModelSubscriptionEmployeeFilterInput) {
    onUpdateEmployee(filter: $filter) {
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
export const onUpdateImportedObject = /* GraphQL */ `
  subscription OnUpdateImportedObject(
    $filter: ModelSubscriptionImportedObjectFilterInput
  ) {
    onUpdateImportedObject(filter: $filter) {
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
export const onUpdateItem = /* GraphQL */ `
  subscription OnUpdateItem($filter: ModelSubscriptionItemFilterInput) {
    onUpdateItem(filter: $filter) {
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
export const onUpdateItemCategory = /* GraphQL */ `
  subscription OnUpdateItemCategory(
    $filter: ModelSubscriptionItemCategoryFilterInput
  ) {
    onUpdateItemCategory(filter: $filter) {
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
export const onUpdateSyncData = /* GraphQL */ `
  subscription OnUpdateSyncData($filter: ModelSubscriptionSyncDataFilterInput) {
    onUpdateSyncData(filter: $filter) {
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
export const onUpdateTransaction = /* GraphQL */ `
  subscription OnUpdateTransaction(
    $filter: ModelSubscriptionTransactionFilterInput
  ) {
    onUpdateTransaction(filter: $filter) {
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
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $profileOwner: String
  ) {
    onUpdateUserProfile(filter: $filter, profileOwner: $profileOwner) {
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
