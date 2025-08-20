export function formatDateForInput(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const dateInLocalTime = new Date(date.getTime() + userTimezoneOffset);

    const year = dateInLocalTime.getFullYear();
    const month = (dateInLocalTime.getMonth() + 1).toString().padStart(2, "0");
    const day = dateInLocalTime.getDate().toString().padStart(2, "0");
    
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}

export function formatLastLogin(dateString: string | null): string {
  if (!dateString) return "Nunca logado";
  
  const loginDate = new Date(dateString);
  if (isNaN(loginDate.getTime())) {
    return "Data inválida";
  }
  const now = new Date();

  const isToday = loginDate.toDateString() === now.toDateString();
  
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = loginDate.toDateString() === yesterday.toDateString();
  
  const time = loginDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return `Hoje às ${time}`;
  } else if (isYesterday) {
    return `Ontem às ${time}`;
  } else {
    return `${loginDate.toLocaleDateString("pt-BR")} às ${time}`;
  }
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "--"; 

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Data inválida";
  }

  return date.toLocaleDateString("pt-BR", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC' 
  });
}
