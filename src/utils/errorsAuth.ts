function isErrorWithMessage(error: unknown): error is { message: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
    );
  }
  
  export const handleAuthError = (error: unknown, defaultMessage: string): Error => {
    if (error instanceof Error) {
      return error;
    }
  
    if (isErrorWithMessage(error)) {
      return new Error(error.message);
    }
  
    return new Error(defaultMessage);
  };