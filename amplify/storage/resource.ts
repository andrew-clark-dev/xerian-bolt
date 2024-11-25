import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'drive',

    access: (allow) => ({
        'data/{entity_id}/*': [
            // {entity_id} is the token that is replaced with the user identity id
            allow.entity('identity').to(['read', 'write', 'delete'])
        ]
    })
});