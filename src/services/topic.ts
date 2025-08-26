export interface NewTopicData {
  title: string;
  content: string;
  category: string;
}

export interface UpdateTopicData {
  title?: string;
  content?: string;
}

export interface NewCommentData {
  content: string;
  topicId: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function getTopicsByCategory(category: string) {
  const response = await fetch(`${API_URL}/posts/topics/category/${category}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar tópicos da categoria.');
  }
  return response.json();
}

export async function getTopicBySlug(slug: string) {
  const response = await fetch(`${API_URL}/topics/slug/${slug}`);
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
  const response = await fetch(`${API_URL}/topics/${topicId}`, {
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
    const response = await fetch(`${API_URL}/topics/${topicId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  
    if (!response.ok) {
      throw new Error('Falha ao deletar o tópico.');
    }
    return;
  }
  
export async function createComment(data: NewCommentData) {
  const response = await fetch(`${API_URL}/topics/${data.topicId}/comments`, {
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
