export function getRoleColor(role?: string) {
  switch (role?.toLowerCase()) {
    case "visitante":
      return "text-green-500";
    case "partner":
      return "text-orange-500";
    case "auditore":
      return "text-blue-500";
    case "leader":
      return "text-pink-500";
    case "fundador":
      return "text-red-500";
    case "desenvolvedor":
      return "text-yellow-500";
    default:
      return "text-gray-300";
  }
}
