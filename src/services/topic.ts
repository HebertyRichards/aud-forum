import { NewTopicData, UpdateTopicData, NewCommentData } from "@/types/post";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocorreu um erro desconhecido.";
};

export async function getTopicsByCategory(category: string) {
  try {
    const response = await axios.get(`${API_URL}/categories/topics/category/${category}`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));  
  }
}

export async function getTopicBySlug(slug: string) {
  try {
    const response = await axios.get(`${API_URL}/posts/topics/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));  
  }
}

export async function createTopic(data: NewTopicData) {
  try {
    const response = await axios.post(`${API_URL}/posts/topics`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));  
  }
}

export async function updateTopic(topicId: number, data: UpdateTopicData) {
  try {
    const response = await axios.patch(`${API_URL}/posts/topics/${topicId}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));  
  }
}

export async function deleteTopic(topicId: number) {
  try {
    await axios.delete(`${API_URL}/posts/topics/${topicId}`, {
      withCredentials: true,
    });
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));  
  }
}

export async function deleteComment(commentId: number) {
  try {
    await axios.delete(`${API_URL}/posts/comments/${commentId}`, {
      withCredentials: true,
    });
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));  
  }
}

export async function updateComment(commentId: number, content: string) {
  try {
    const response = await axios.patch(`${API_URL}/posts/comments/${commentId}`, { content }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));  
  }
}

export async function createComment(data: NewCommentData) {
  try {
    const response = await axios.post(
      `${API_URL}/posts/topics/${data.topicId}/comments`,
      { content: data.content }, 
      { withCredentials: true }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));  
  }
}

export async function checkTopicCreationPermission(category: string): Promise<boolean> {
  try {
    const response = await axios.post(`${API_URL}/permission/topics/check-permission`, 
      { category }, 
      { withCredentials: true }
    );
    return response.data.allowed;
  } catch {
    return false;
  }
}

export async function checkCommentCreationPermission(topicId: number): Promise<boolean> {
  try {
    const response = await axios.get(`${API_URL}/permission/comments/${topicId}/check-permission`, {
      withCredentials: true,
    });
    return response.data.allowed;
  } catch {
    return false;
  }
}
