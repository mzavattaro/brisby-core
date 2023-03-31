// @ts-check
import { clientEnv, clientSchema } from './schema.mjs';

// eslint-disable-next-line no-underscore-dangle
const _clientEnv = clientSchema.safeParse(clientEnv);
console.log('parsed', _clientEnv);

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value)
        // eslint-disable-next-line no-underscore-dangle
        return `${name}: ${value._errors.join(', ')}\n`;
      return null;
    })
    .filter(Boolean);

if (!_clientEnv.success) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Invalid environment variables:\n',
    ...formatErrors(_clientEnv.error.format())
  );
  throw new Error('Invalid environment variables');
}

for (const key of Object.keys(_clientEnv.data)) {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    // eslint-disable-next-line no-console
    console.warn(
      `❌ Invalid public environment variable name: ${key}. It must begin with 'NEXT_PUBLIC_'`
    );

    throw new Error('Invalid public environment variable name');
  }
}

export const env = _clientEnv.data;
