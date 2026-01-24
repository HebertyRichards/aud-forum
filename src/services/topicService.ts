import { NewTopic, UpdateTopic, NewComment, TopicDetails, TopicSummary } from "@/schema/forum";
import { httpClient } from "./core/httpClient";
import { handleError } from "@/utils/errorsApi";


export interface TopicsResponse {
  data: TopicSummary[];
  totalCount: number;
}

export interface TopicWithCommentsResponse {
  data: TopicDetails;
  totalComments: number;
}

export interface PermissionResponse {
  allowed: boolean;
}

export const topicService = {
  async getTopicsByCategory(
    category: string,
    page: number,
    limit: number
  ): Promise<TopicsResponse> {
    try {
      const response = await httpClient.get<TopicsResponse>(
        `/categories/topics/category/${category}?page=${page}&limit=${limit}`
      );
      if (!response) return { data: [], totalCount: 0 };
      return response;
    } catch (error) {
      throw handleError(error, "Failed to get topics");
    }
  },

  async getTopicBySlug(slug: string): Promise<TopicDetails> {
    try {
      const response = await httpClient.get<{ data: TopicDetails }>(
        `/posts/topics/slug/${slug}`
      );
      if (!response) throw new Error("Topic not found");
      return response.data;
    } catch (error) {
      throw handleError(error, "Failed to get topic");
    }
  },

  async getTopicBySlugWithComments(
    slug: string,
    page: number,
    limit: number
  ): Promise<TopicWithCommentsResponse> {
    try {
      const response = await httpClient.get<TopicWithCommentsResponse>(
        `/posts/topics/slug/${slug}?page=${page}&limit=${limit}`
      );
      if (!response) throw new Error("Topic not found");
      return response;
    } catch (error) {
      throw handleError(error, "Failed to get topic with comments");
    }
  },

  async createTopic(data: NewTopic, images: File[]): Promise<{ slug: string }> {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("category", data.category);
      images.forEach((image) => {
        formData.append("files", image);
      });
      const response = await httpClient.post<{ slug: string }>("/posts/topics", formData);
      if (!response) throw new Error("Failed to create topic");
      return response;
    } catch (error) {
      throw handleError(error, "Failed to create topic");
    }
  },

  async updateTopic(topicId: number, data: UpdateTopic): Promise<unknown> {
    try {
      return await httpClient.patch(`/posts/topics/${topicId}`, data);
    } catch (error) {
      throw handleError(error, "Failed to update topic");
    }
  },

  async deleteTopic(topicId: number): Promise<void> {
    try {
      await httpClient.delete(`/posts/topics/${topicId}`);
    } catch (error) {
      throw handleError(error, "Failed to delete topic");
    }
  },

  async createComment(data: NewComment, images: File[]): Promise<unknown> {
    try {
      const formData = new FormData();
      if (data.content) {
        formData.append("content", data.content);
      }
      images.forEach((image) => {
        formData.append("files", image);
      });
      return await httpClient.post(`/posts/topics/${data.topicId}/comments`, formData);
    } catch (error) {
      throw handleError(error, "Failed to create comment");
    }
  },

  async updateComment(commentId: number, content: string): Promise<unknown> {
    try {
      return await httpClient.patch(`/posts/comments/${commentId}`, { content });
    } catch (error) {
      throw handleError(error, "Failed to update comment");
    }
  },

  async deleteComment(commentId: number): Promise<void> {
    try {
      await httpClient.delete(`/posts/comments/${commentId}`);
    } catch (error) {
      throw handleError(error, "Failed to delete comment");
    }
  },

  async checkTopicCreationPermission(category: string): Promise<boolean> {
    try {
      const response = await httpClient.post<PermissionResponse>(
        "/permission/topics/check-permission",
        { category }
      );
      return response?.allowed ?? false;
    } catch {
      return false;
    }
  },

  async checkCommentCreationPermission(topicId: number): Promise<boolean> {
    try {
      const response = await httpClient.get<PermissionResponse>(
        `/permission/comments/${topicId}/check-permission`
      );
      return response?.allowed ?? false;
    } catch {
      return false;
    }
  },
};
