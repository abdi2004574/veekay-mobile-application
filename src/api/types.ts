export type UserRole = 'traveler' | 'agency' | 'admin';

export type DestinationType = 'beach' | 'mountain' | 'city' | 'adventure' | 'cruise';
export type TravelStyle = 'luxury' | 'budget' | 'backpacking' | 'family' | 'solo' | 'group';
export type Gender = 'male' | 'female' | 'other';

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
  imageUrl: string | null;
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
  imageUrl: string | null;
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
  phone: string | null;
  photoMediaId: string | null;
  badge: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  destinationTypes: DestinationType[];
  travelStyles: TravelStyle[];
  friendsCount: number;
  postsCount: number;
  campaignsCount: number;
}

export type ProfileVisibility = 'public' | 'friends' | 'private';

export interface NotificationListItem {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  deepLinkTarget: string | null;
  deepLinkEntityId: string | null;
  metadata: Record<string, unknown> | null;
  channel: string;
  createdAt: string;
  pushSentAt: string | null;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationPreferenceItem {
  type: string;
  inAppEnabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

export interface PushDevice {
  id: string;
  userId: string;
  fcmToken: string;
  platform: string;
  lastSeenAt: string | null;
  createdAt: string;
}

export interface PrivacySettings {
  profileVisibility: ProfileVisibility;
  activityStatusVisible: boolean;
  readReceiptsEnabled: boolean;
}

export type ConversationType = 'direct' | 'group' | 'agency';
export type ConversationParticipantRole = 'member' | 'admin';
export type MessageType = 'text' | 'image' | 'document';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ConversationSummary {
  id: string;
  type: ConversationType;
  title: string;
  memberCount?: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ConversationMember {
  id: string;
  username: string;
  displayName: string | null;
  role: ConversationParticipantRole;
}

export interface ConversationDetail {
  id: string;
  type: ConversationType;
  title: string;
  members?: ConversationMember[];
}

export interface MessageSender {
  id: string;
  username: string;
  displayName: string | null;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  type: MessageType;
  body: string | null;
  fileName: string | null;
  mediaUrl: string | null;
  createdAt: string;
  status?: MessageStatus;
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

export interface AgencyDirectoryEntry {
  id: string;
  agencyName: string;
  description: string | null;
  reputationScore: number | null;
  reviewCount: number;
}

export interface ReviewAuthor {
  id: string;
  username: string;
  displayName: string | null;
}

export interface AgencyReview {
  id: string;
  agencyId: string;
  rating: number;
  body: string | null;
  createdAt: string;
  updatedAt: string;
  reviewer: ReviewAuthor;
}

export interface MyReview {
  id: string;
  agencyId: string;
  agencyName: string;
  rating: number;
  body: string | null;
  createdAt: string;
  canEdit: boolean;
  editableUntil: string;
}

export type CampaignPrivacy = 'public' | 'private';
export type CampaignStatus = 'draft' | 'active' | 'completed';

export interface CampaignPhoto {
  mediaId: string;
  position: number;
  url: string | null;
}

export interface Campaign {
  id: string;
  creatorId: string;
  title: string;
  destination: string;
  goalAmount: number;
  currency: string;
  story: string | null;
  tripStartDate: string;
  tripEndDate: string | null;
  status: CampaignStatus;
  privacy: CampaignPrivacy;
  giftMode: boolean;
  giftOccasion: string | null;
  itineraryMediaId: string | null;
  agencyQuoteMediaId: string | null;
  viewsCount: number;
  createdAt: string;
  photos: CampaignPhoto[];
  contributorsCount: number;
  raisedAmount: number;
  isGroup: boolean;
}

export interface CampaignDetail extends Campaign {
  isCreator: boolean;
  creator: { id: string; username: string; displayName: string | null };
}

export type GroupMemberRole = 'admin' | 'member';
export type GroupExpenseCategory =
  | 'transportation'
  | 'accommodation'
  | 'activities'
  | 'food'
  | 'other';

export interface GroupMember {
  userId: string;
  username: string;
  displayName: string | null;
  role: GroupMemberRole;
  isCreator: boolean;
  contributed: number;
  percentage: number;
}

export interface GroupOverview {
  id: string;
  title: string;
  destination: string;
  goalAmount: number;
  tripStartDate: string;
  tripEndDate: string | null;
  groupConversationId: string | null;
  totalRaised: number;
  totalSpent: number;
  members: GroupMember[];
}

export interface GroupContributionAuthor {
  id: string;
  username: string;
  displayName: string | null;
}

export interface GroupContribution {
  id: string;
  campaignId: string;
  memberUserId: string;
  amount: number;
  type: 'manual' | 'donation';
  note: string | null;
  createdAt: string;
  member: GroupContributionAuthor;
}

export interface GroupExpense {
  id: string;
  campaignId: string;
  name: string;
  amount: number;
  category: GroupExpenseCategory;
  paidByUserId: string;
  spentAt: string;
  createdAt: string;
  paidBy: GroupContributionAuthor;
}

export interface GroupTrip {
  id: string;
  title: string;
  destination: string;
  goalAmount: number;
  memberCount: number;
  raised: number;
  photoUrl: string | null;
}


export type PackageStatus = 'active' | 'inactive' | 'archived';

export interface PackageMediaEntry {
  mediaId: string;
  displayOrder: number;
  url: string | null;
}

export interface PackageAgency {
  id: string;
  agencyName: string;
  reputationScore: number | null;
}

export interface Package {
  id: string;
  agencyId: string;
  title: string;
  description: string | null;
  basePrice: number;
  currency: string;
  destinationType: DestinationType | null;
  season: string | null;
  theme: string | null;
  itinerary: string | null;
  status: PackageStatus;
  createdAt: string;
  updatedAt: string;
  media: PackageMediaEntry[];
  agency: PackageAgency | null;
}

export type TripRequestStatus =
  | 'pending'
  | 'in_discussion'
  | 'confirmed'
  | 'completed'
  | 'declined'
  | 'cancelled';

export interface TripRequestTraveler {
  id: string;
  username: string;
  displayName: string | null;
}

export interface TripRequestAgencySummary {
  id: string;
  agencyName: string;
  status: string;
}

export interface TripRequestPackageRef {
  id: string;
  title: string;
  basePrice: number;
  currency: string;
}

export interface TripRequestCampaignRef {
  id: string;
  title: string;
  destination: string;
}

export interface TripRequest {
  id: string;
  travelerId: string;
  agencyId: string;
  packageId: string | null;
  campaignId: string | null;
  status: TripRequestStatus;
  initialMessage: string;
  conversationId: string | null;
  createdAt: string;
  updatedAt: string;
  traveler: TripRequestTraveler;
  agency: TripRequestAgencySummary;
  package: TripRequestPackageRef | null;
  campaign: TripRequestCampaignRef | null;
}

export interface SmartReplyTemplate {
  id: string;
  agencyId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}
export type WalletTransactionDirection = 'credit' | 'debit';

export type WalletTransactionType =
  | 'donation_received'
  | 'donation_fee'
  | 'withdrawal'
  | 'refund'
  | 'commission'
  | 'booking_payment';

export type WithdrawalStatus = 'requested' | 'approved' | 'rejected' | 'paid';

export type FundingTrendRange = '7d' | '30d' | '90d';

export interface WalletAccount {
  id: string;
  currency: string;
  balance: number;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  direction: WalletTransactionDirection;
  amount: number;
  currency: string;
  type: WalletTransactionType;
  referenceType: string | null;
  referenceId: string | null;
  description: string | null;
  createdAt: string;
}

export interface WalletTransactionsPage {
  items: WalletTransaction[];
  nextCursor: string | null;
}

export interface WithdrawalRequest {
  id: string;
  campaignId: string | null;
  amount: number;
  currency: string;
  status: WithdrawalStatus;
  rejectionReason: string | null;
  refundNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalsPage {
  items: WithdrawalRequest[];
  nextCursor: string | null;
}

export interface CreateWithdrawalInput {
  amount: number;
  currency: string;
  campaignId?: string;
}

export interface DonateManualInput {
  amount: number;
  currency?: string;
  donorDisplayName?: string;
  isAnonymous?: boolean;
  isGift?: boolean;
  giftMessage?: string;
}

export interface DonateManualResponse {
  amount: number;
  currency: string;
  raisedAmount: number;
  walletTransactionId: string;
}

export type AgencySubscriptionTier = 'basic' | 'premium' | 'featured';

export interface SubscriptionStatusResponse {
  tier: AgencySubscriptionTier;
  isActive: boolean;
  expiresAt: string | null;
  isSandbox: boolean;
  managementURL: string | null;
}
