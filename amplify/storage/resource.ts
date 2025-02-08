import { defineStorage } from '@aws-amplify/backend';
import { importAccountFunction, importItemFunction, importReceiveFunction } from '../data/import/resource';

export const storage = defineStorage({
    name: 'drive',

    access: (allow) => ({
        'data/{entity_id}/*': [
            // {entity_id} is the token that is replaced with the user identity id
            allow.entity('identity').to(['read', 'write', 'delete'])
        ],

        'import/*': [
            allow.resource(importReceiveFunction).to(['read', 'write', 'delete']),
        ],
        'import/processing/*': [
            allow.resource(importAccountFunction).to(['read', 'write', 'delete']),
            allow.resource(importItemFunction).to(['read', 'write', 'delete']),
        ],
        'import/archive/*': [
            allow.resource(importReceiveFunction).to(['read', 'write', 'delete']),
            allow.resource(importAccountFunction).to(['read', 'write', 'delete']),
            allow.resource(importItemFunction).to(['read', 'write', 'delete']),
        ]
    })
});