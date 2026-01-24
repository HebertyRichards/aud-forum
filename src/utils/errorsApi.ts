export function handleError(error: unknown, defaultMessage: string): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return new Error(defaultMessage);
}