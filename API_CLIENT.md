# API Client Generation

This project uses [Orval](https://orval.dev/) to generate a type-safe React Query client from the OpenAPI specification.

## Setup

1. Make sure your backend API is running at `http://localhost:8080`
2. Copy `.env.local.example` to `.env.local` if you need to change the API URL
3. Generate the API client:

```bash
pnpm run generate:api
```

This will fetch the OpenAPI spec from `http://localhost:8080/api/openapi.json` and generate:

- TypeScript types in `lib/api/models/`
- React Query hooks in `lib/api/endpoints/`

## Usage

The generated hooks follow React Query conventions:

```tsx
import { useGetMovies } from "@/lib/api/endpoints/movies";

export function MovieList() {
  const { data, isLoading, error } = useGetMovies();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map((movie) => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  );
}
```

## Configuration

Edit `orval.config.ts` to customize:

- Output directories
- Naming conventions
- HTTP client configuration
- And more...

The custom HTTP client is defined in `lib/api/mutator.ts` and can be modified to add:

- Authentication headers
- Request/response interceptors
- Error handling
- Base URL configuration

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:8080`)
