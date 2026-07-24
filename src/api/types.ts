export type UserRole = 'traveler' | 'agency' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  onboardingComplete: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'BUSINESS_RULE'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export interface ApiErrorBody {
  success: false;
  error: { code: ApiErrorCode; message: string };
}

export interface ApiSuccessBody<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface PostAuthor {
  id: string;
  username: string;
  displayName: string | null;
  travelerProfile: { photoMediaId: string | null } | null;
}

export interface Post {
  id: string;
  authorId: string;
  text: string;
  imageMediaId: string | null;
  location: string | null;
  tags: string[];
  repostOfId: string | null;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  repostOf: (Post & { author: PostAuthor }) | null;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  likesCount: number;
  isLikedByMe: boolean;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export type StoryTextSize = 'small' | 'medium' | 'large';

export interface Story {
  id: string;
  authorId: string;
  imageMediaId: string | null;
  text: string | null;
  backgroundColor: string | null;
  textSize: StoryTextSize | null;
  createdAt: string;
  expiresAt: string;
  author: PostAuthor;
  _count: { likes: number; views: number };
}

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface FriendUser {
  id: string;
  username: string;
  displayName: string | null;
  travelerProfile: { photoMediaId: string | null } | null;
}

export interface TravelerSearchResult {
  id: string;
  username: string;
  displayName: string | null;
  photoMediaId: string | null;
  isFriend: boolean;
  requestSent: boolean;
  requestReceived: boolean;
}

export interface FriendRequest {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendRequestStatus;
  createdAt: string;
  respondedAt: string | null;
  requester: FriendUser;
}

export interface MeProfile {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  onboardingComplete: boolean;
  bio: string | null;
  location: string | null;
  photoMediaId: string | null;
  badge: string | null;
  friendsCount: number;
  postsCount: number;
}

export interface PublicProfile {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  location: string | null;
  photoMediaId: string | null;
  badge: string | null;
  friendsCount: number;
  postsCount: number;
  campaignsCount: number;
  tripsCount: number;
  isFriend: boolean;
  requestSent: boolean;
  requestReceived: boolean;
  isSelf: boolean;
  mutualFriendsCount: number;
}
