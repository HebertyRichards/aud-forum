export function getRoleColor(role?: string) {
  switch (role?.toLowerCase()) {
    case "visitante":
      return "text-green-600 dark:text-green-400";
    case "partner":
      return "text-orange-600 dark:text-orange-400";
    case "auditore":
      return "text-blue-600 dark:text-blue-400";
    case "leader":
      return "text-pink-600 dark:text-pink-400";
    case "fundador":
      return "text-red-600 dark:text-red-400";
    case "desenvolvedor":
      return "text-yellow-600 dark:text-yellow-400";
    default:
      return "text-gray-300 dark:text-gray-400";
  }
}
