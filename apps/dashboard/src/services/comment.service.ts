import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../packages/backend/amplify/data/resource';
import { currentUserId, UserProfile } from './profile.service';
import { checkedResponse } from './utils/error.utils';

const client = generateClient<Schema>();

export type Comment = Schema['Comment']['type'];
export type CommentCreate = Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityBy' | 'status'>;
export type CommentUpdate = Partial<Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityBy'>> & { id: string };




interface ListCommentsOptions {
  limit?: number;
  nextToken?: string | null;
  sort?: {
    field: keyof Comment;
    direction: 'asc' | 'desc';
  };
}

class CommentService {


  async createComment(comment: CommentCreate): Promise<Comment> {
    const response = await client.models.Comment.create({
      ...comment,
      lastActivityBy: await currentUserId(),
    });

    return checkedResponse(response) as Comment;
  }

  async updateComment(update: CommentUpdate): Promise<Comment> {
    const response = await client.models.Comment.update({
      ...update,
      lastActivityBy: await currentUserId()
    });

    return checkedResponse(response) as Comment;
  }

  async listCommentsByUser(user: UserProfile, options: ListCommentsOptions = {}): Promise<{ comments: Comment[]; nextToken: string | null }> {
    const response = await client.models.Comment.list({
      limit: options.limit || 10,
      nextToken: options.nextToken,
      filter: {
        userId: {
          eq: user.id
        }
      }
    });

    return { comments: checkedResponse(response) as Comment[], nextToken: response.nextToken ?? null };
  }

  async listCommentsByRef(refId: string): Promise<{ comments: Comment[] }> {
    const response = await client.models.Comment.listCommentByRefId({ refId });
    return { comments: checkedResponse(response) as Comment[] };
  }


}

export const commentService = new CommentService();