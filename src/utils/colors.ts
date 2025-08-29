export function getRoleColor(role?: string) {
  switch (role?.toLowerCase()) {
    case "visitante":
      return "text-green-700 dark:text-green-400";
    case "partner":
      return "text-yellow-700 dark:text-yellow-400";
    case "membro":
      return "text-blue-700 dark:text-blue-400";
    case "leader":
      return "text-pink-700 dark:text-pink-400";
    case "fundador":
      return "text-red-800 dark:text-red-500";
    case "desenvolvedor":
      return "text-yellow-700 dark:text-yellow-400";
    default:
      return "text-gray-700 dark:text-gray-400";
  }
}