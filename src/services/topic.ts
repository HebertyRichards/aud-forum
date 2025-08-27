import { NewTopicData, UpdateTopicData, NewCommentData } from "@/types/post";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function getTopicsByCategory(category: string) {
  const response = await fetch(`${API_URL}/posts/topics/category/${category}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar tópicos da categoria.');
  }
  return response.json();
}

export async function getTopicBySlug(slug: string) {
  const response = await fetch(`${API_URL}/posts/topics/slug/${slug}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar o tópico.');
  }
  return response.json();
}

export async function createTopic(data: NewTopicData) {
  const response = await fetch(`${API_URL}/posts/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar o tópico. Verifique se você está logado.');
  }
  return response.json();
}

export async function updateTopic(topicId: number, data: UpdateTopicData) {
  const response = await fetch(`${API_URL}/posts/topics/${topicId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Falha ao atualizar o tópico.');
  }
  return response.json();
}

export async function deleteTopic(topicId: number) {
    const response = await fetch(`${API_URL}/posts/topics/${topicId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  
    if (!response.ok) {
      throw new Error('Falha ao deletar o tópico.');
    }
    return;
  }
  
  export async function deleteComment(commentId: number) {
    const response = await fetch(`${API_URL}/posts/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Falha ao deletar o comentário.');
    }
    return;
  }

export async function createComment(data: NewCommentData) {
  const response = await fetch(`${API_URL}/posts/topics/${data.topicId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
    body: JSON.stringify({ content: data.content }),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar o comentário.');
  }
  return response.json();
}
