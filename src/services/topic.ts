import { NewTopic, UpdateTopic, NewComment } from "@/schema/forum";
import { handleApiError } from "@/utils/apiErrors";
import { API_URL } from "@/utils/forum-structure";

export async function getTopicsByCategory(
  category: string,
  page: number,
  limit: number
) {
  try {
    const response = await fetch(
      `/api/categories/topics/category/${category}?page=${page}&limit=${limit}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao buscar os tópicos da categoria.");
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, "Falha ao buscar os tópicos da categoria.");
  }
}

export async function getTopicBySlug(slug: string) {
  try {
    const response = await fetch(`${API_URL}/posts/topics/slug/${slug}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar o tópico.");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error, "Falha ao buscar o tópico.");
  }
}

export async function getTopicBySlugWithComments(
  slug: string,
  page: number,
  limit: number
) {
  try {
    const response = await fetch(
      `/api/posts/topics/slug/${slug}?page=${page}&limit=${limit}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao buscar o tópico com comentários.");
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, "Falha ao buscar o tópico com comentários.");
  }
}

export async function createTopic(data: NewTopic, images: File[]) {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category", data.category);
    images.forEach((image) => {
      formData.append("files", image);
    });

    const response = await fetch(`/api/posts/topics`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Falha ao criar o tópico.");
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, "Falha ao criar o tópico.");
    throw new Error("Ocorreu um erro desconhecido.");
  }
}

export async function updateTopic(topicId: number, data: UpdateTopic) {
  try {
    const response = await fetch(`/api/posts/topics/${topicId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Falha ao atualizar o tópico.");
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, "Falha ao atualizar o tópico.");
  }
}

export async function deleteTopic(topicId: number) {
  try {
    const response = await fetch(`/api/posts/topics/${topicId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Falha ao deletar o tópico.");
    }
  } catch (error) {
    handleApiError(error, "Falha ao deletar o tópico.");
  }
}

export async function deleteComment(commentId: number) {
  try {
    const response = await fetch(`/api/posts/comments/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Falha ao deletar o comentário.");
    }
  } catch (error) {
    handleApiError(error, "Falha ao deletar o comentário.");
  }
}

export async function updateComment(commentId: number, content: string) {
  try {
    const response = await fetch(`/api/posts/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Falha ao atualizar o comentário.");
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, "Falha ao atualizar o comentário.");
  }
}

export async function createComment(data: NewComment, images: File[]) {
  try {
    const formData = new FormData();
    if (data.content) {
      formData.append("content", data.content);
    }
    images.forEach((image) => {
      formData.append("files", image);
    });

    const response = await fetch(`/api/posts/topics/${data.topicId}/comments`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Falha ao criar o comentário.");
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, "Falha ao criar o comentário.");
  }
}

export async function checkTopicCreationPermission(
  category: string
): Promise<boolean> {
  try {
    const response = await fetch(`/api/permission/topics/check-permission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category }),
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.allowed;
  } catch {
    return false;
  }
}

export async function checkCommentCreationPermission(
  topicId: number
): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/permission/comments/${topicId}/check-permission`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.allowed;
  } catch {
    return false;
  }
}
