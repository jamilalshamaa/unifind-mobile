/**
 * blockApi — Node API transport for blocked users (Apple 1.2).
 * Backend: Node (nodeApi + Auth0 Bearer). Transport only.
 *
 * Endpoints:
 *   GET    /users/blocked         → { blockedUsers: string[] }
 *   POST   /users/block/:userId   → { blockedUsers: string[] }
 *   DELETE /users/block/:userId   → { blockedUsers: string[] }
 *
 * The user id is the Auth0 sub of the review author (for example "auth0|abc").
 */

import { nodeApi } from "@/api/nodeApi";

type BlockedResponse = { blockedUsers?: string[] };

const path = (userId: string) => `/users/block/${encodeURIComponent(userId)}`;

export const blockApi = {
  async getBlockedUsers(): Promise<string[]> {
    const res = await nodeApi.get<BlockedResponse>("/users/blocked");
    return res.data?.blockedUsers ?? [];
  },

  async blockUser(userId: string): Promise<string[]> {
    const res = await nodeApi.post<BlockedResponse>(path(userId), {});
    return res.data?.blockedUsers ?? [userId];
  },

  async unblockUser(userId: string): Promise<string[]> {
    const res = await nodeApi.delete<BlockedResponse>(path(userId));
    return res.data?.blockedUsers ?? [];
  },
};
