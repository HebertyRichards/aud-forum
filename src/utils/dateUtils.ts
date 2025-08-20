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
    return `${formatDate(dateString)} às ${time}`;
  }
}

export function formatJoinDate(dateString: string): string {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }

    return formatDate(dateString);
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "--";
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length !== 3) return "Data inválida";

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day}/${month}/${year}`;
}