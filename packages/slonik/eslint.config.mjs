import config from '@nestingjs/eslint-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(...config, {
  files: ['**/*.{js,cjs,mjs,ts,cts,mts}'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: ['./tsconfig.eslint.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
