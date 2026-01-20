export { httpClient } from "./core/httpClient";
export type { RequestConfig, ApiError } from "./core/httpClient";
export { authService } from "./authService";
export type { LoginCredentials, RegisterData, UpdatePasswordData } from "./authService";

export { categoryService } from "./categoryService";
export type { ApiCategory } from "./categoryService";

export { followService } from "./followService";
export type { OwnProfileData, UserProfileData } from "./followService";

export { memberService } from "./memberService";
export type { MembersResult } from "./memberService";

export { profileService } from "./profileService";
export type {
  UpdateProfileData,
  UpdateContactsPayload,
  UpdateProfileDataPayload,
  AvatarResponse,
} from "./profileService";

export { topicService } from "./topicService";
export type {
  TopicsResponse,
  TopicWithCommentsResponse,
  PermissionResponse,
} from "./topicService";