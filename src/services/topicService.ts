import { NewTopic, UpdateTopic, NewComment, TopicDetails, TopicSummary } from "@/schema/forum";
import { httpClient } from "./core/httpClient";


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
    const response = await httpClient.get<TopicsResponse>(
      `/categories/topics/category/${category}?page=${page}&limit=${limit}`
    );
    if (!response) return { data: [], totalCount: 0 };
    return response;
  },

  async getTopicBySlug(slug: string): Promise<TopicDetails> {
    const response = await httpClient.get<{ data: TopicDetails }>(
      `/posts/topics/slug/${slug}`
    );
    if (!response) throw new Error("Topic not found");
    return response.data;
  },

  async getTopicBySlugWithComments(
    slug: string,
    page: number,
    limit: number
  ): Promise<TopicWithCommentsResponse> {
    const response = await httpClient.get<TopicWithCommentsResponse>(
      `/posts/topics/slug/${slug}?page=${page}&limit=${limit}`
    );
    if (!response) throw new Error("Topic not found");
    return response;
  },

  async createTopic(data: NewTopic, images: File[]): Promise<{ slug: string }> {
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
  },

  async updateTopic(topicId: number, data: UpdateTopic): Promise<unknown> {
    return httpClient.patch(`/posts/topics/${topicId}`, data);
  },

  async deleteTopic(topicId: number): Promise<void> {
    await httpClient.delete(`/posts/topics/${topicId}`);
  },

  async createComment(data: NewComment, images: File[]): Promise<unknown> {
    const formData = new FormData();
    if (data.content) {
      formData.append("content", data.content);
    }
    images.forEach((image) => {
      formData.append("files", image);
    });
    return httpClient.post(`/posts/topics/${data.topicId}/comments`, formData);
  },

  async updateComment(commentId: number, content: string): Promise<unknown> {
    return httpClient.patch(`/posts/comments/${commentId}`, { content });
  },

  async deleteComment(commentId: number): Promise<void> {
    await httpClient.delete(`/posts/comments/${commentId}`);
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
