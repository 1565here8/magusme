export type KycStatus = "none" | "pending" | "verified" | "rejected";

export type SocialProfile = {
  userId: string;
  handle: string;
  displayName: string;
  bio: string;
  interests: string[];
  traditions: string[];
  isServiceProvider: boolean;
  kycStatus: KycStatus;
  kycProvider?: string;
  createdAt: string;
  updatedAt: string;
};

export type SocialProfilePublic = Pick<
  SocialProfile,
  "userId" | "handle" | "displayName" | "bio" | "interests" | "traditions" | "isServiceProvider" | "kycStatus"
>;

export type FriendshipStatus = "pending" | "accepted" | "blocked";

export type Friendship = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: string;
  peer?: SocialProfilePublic;
};

export type SocialGroup = {
  id: string;
  slug: string;
  name: string;
  description: string;
  ownerId: string;
  isPublic: boolean;
  emoji: string;
  memberCount: number;
  joined: boolean;
  createdAt: string;
};

export type SocialPost = {
  id: string;
  authorId: string;
  groupId: string | null;
  body: string;
  createdAt: string;
  author?: SocialProfilePublic;
  groupName?: string;
};

export type Conversation = {
  id: string;
  updatedAt: string;
  peers: SocialProfilePublic[];
  lastMessage?: { body: string; createdAt: string; senderId: string };
  unread: boolean;
};

export type SocialMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  sender?: SocialProfilePublic;
};
