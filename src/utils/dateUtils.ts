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

export function formatJoinDate(dateString: string): string {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }

    return date.toLocaleDateString("pt-BR");
}

export function formatDate(dateStr?: string) {
  if (!dateStr) return "--";
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
