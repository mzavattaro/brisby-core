import { ZodError } from 'zod';

export const parseError = (error: unknown): string => {
  const message =
    error instanceof Error || error instanceof ZodError
      ? error.message
      : String(error);

  return message;
};

export const handleError = (error: unknown): void => {
  const message = parseError(error);

  // eslint-disable-next-line no-console
  console.log(message);
};
