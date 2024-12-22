# eslint-config

eslint-config for Nest.js applications.

# Installation

```bash
npx install-peerdeps @nestingjs/eslint-config -d
```

# Usage

```ts
import tseslint from 'typescript-eslint';

import config from '@nestingjs/eslint-config';

export default tseslint.config(...config, {
  files: ['**/*.{js,mjs,ts,mts,tsx}'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: ['./tsconfig.eslint.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```
