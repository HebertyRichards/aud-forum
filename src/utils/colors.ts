export function getRoleColor(role?: string) {
  switch (role?.toLowerCase()) {
    case "visitante":
      return "text-green-400";
    case "partner":
      return "text-orange-400";
    case "auditore":
      return "text-blue-400";
    case "leader":
      return "text-pink-400";
    case "fundador":
      return "text-red-500";
    case "desenvolvedor":
      return "text-yellow-400";
    default:
      return "text-gray-400";
  }
}