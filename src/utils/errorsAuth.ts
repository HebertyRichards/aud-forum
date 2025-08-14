export const handleAuthError = (error: unknown, defaultMessage: string): Error => {
    if (error instanceof Error) {
      return error;
    }
    let message = defaultMessage;
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as any).message === "string"
    ) {
      message = (error as any).message;
    }
    return new Error(message);
  };