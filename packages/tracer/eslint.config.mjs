import tseslint from 'typescript-eslint';

import config from '@nestingjs/eslint-config';

export default tseslint.config(...config, {
  files: ['**/*.{js,mjs,ts,tsx}'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: ['./tsconfig.eslint.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
