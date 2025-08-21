export function getRoleColor(role?: string) {
  switch (role?.toLowerCase()) {
    case "visitante":
      return "text-green-700 dark:text-green-500";
    case "partner":
      return "text-yellow-700 dark:text-yellow-500";
    case "membro":
      return "text-blue-700 dark:text-blue-500";
    case "leader":
      return "text-pink-700 dark:text-pink-500";
    case "fundador":
      return "text-red-700 dark:text-red-500";
    case "desenvolvedor":
      return "text-yellow-800 dark:text-yellow-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}