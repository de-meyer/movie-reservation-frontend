import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:8080/api/openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: 'lib/api/endpoints',
      schemas: 'lib/api/models',
      client: 'react-query',
      override: {
        mutator: {
          path: 'lib/api/mutator.ts',
          name: 'customInstance',
        },
      },
      clean: true,
    },
  },
});
