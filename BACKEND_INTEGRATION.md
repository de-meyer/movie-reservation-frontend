# Backend Integration Setup

This document describes how the frontend has been configured to call the backend API using axios.

## What Was Changed

### 1. **Axios Installation**
- Installed `axios` package for making HTTP requests

### 2. **Updated API Mutator** ([lib/api/mutator.ts](lib/api/mutator.ts))
- Replaced fetch API with axios
- Created an axios instance with:
  - Base URL configuration from environment variable
  - Default headers (Content-Type: application/json)
  - Credentials support for authentication
  - Request interceptor for adding auth tokens from localStorage
  - Response interceptor for global error handling (e.g., 401 unauthorized)

### 3. **Image Path Utility** ([lib/utils.ts](lib/utils.ts))
- Added `getImageUrl()` function to transform database image paths
- Automatically prepends `/landscape/` or `/profile/` to image paths
- Handles cases where paths are already formatted or are full URLs
- Returns placeholder images when no path is provided

### 4. **API Response Transformer** ([lib/api/transform.ts](lib/api/transform.ts))
- Created transformation layer to convert API responses to component format
- `transformProgramToMovie()` - converts ProgramResponse to Movie interface
- `transformProgramsToMovies()` - batch transformation
- Handles date/time formatting for showtimes
- Properly formats movie duration and images

### 5. **Updated Main Page** ([app/page.tsx](app/page.tsx))
- Replaced mock data with real API calls using react-query hooks:
  - `useGetCurrentProgram()` - fetches all current movies
  - `useGetTodayProgram()` - fetches today's movies
  - `useGetTomorrowProgram()` - fetches tomorrow's movies
- Added loading state handling
- Uses `useMemo` for optimal performance when transforming API data

### 6. **Fixed Orval Config** ([orval.config.ts](orval.config.ts))
- Removed invalid `validation` property that was causing TypeScript errors

## Environment Configuration

Create a `.env.local` file in the project root (use `.env.local.example` as reference):

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Note:** The default is `http://localhost:8080` if not specified.

## Image Storage Structure

Your movie images should be stored in the `public` folder:

```
public/
  landscape/     # Landscape/banner images (e.g., 1600x700)
  profile/       # Portrait/poster images (e.g., 600x900)
```

The database stores only the filename (e.g., `movie-1.jpg`), and the `getImageUrl()` utility automatically prepends the correct folder path.

## API Endpoints Used

### Program Endpoints
- `GET /program/current` - All current movies with shows
- `GET /program/today` - Today's movie schedule
- `GET /program/tomorrow` - Tomorrow's movie schedule

### Response Format
The API returns `ProgramResponse[]` with this structure:
```typescript
{
  movie: {
    id: string
    title: string
    description: string
    durationMinutes: number
    director: string
    genre: string
    releaseYear: number
    imageProfile: string      // e.g., "movie-poster.jpg"
    imageLandscape: string    // e.g., "movie-banner.jpg"
  },
  shows: [
    {
      id: string
      theaterName: string
      date: string  // ISO 8601 format
    }
  ]
}
```

## Authentication (Optional)

The axios instance is configured to support authentication:

1. Auth tokens are automatically retrieved from `localStorage.getItem('authToken')`
2. If a token exists, it's added to requests as: `Authorization: Bearer <token>`
3. On 401 responses, the token is automatically cleared

To implement login, store the token after successful authentication:
```typescript
localStorage.setItem('authToken', token)
```

## Testing the Integration

1. **Start your backend server** (default port 8080):
   ```bash
   # In your backend directory
   ./mvnw spring-boot:run
   ```

2. **Start the frontend dev server**:
   ```bash
   pnpm dev
   ```

3. **Visit** `http://localhost:3000`

The app will now fetch real data from your backend API!

## React Query Features

The app now uses TanStack Query (React Query) which provides:
- **Automatic caching** - Reduces unnecessary API calls
- **Background refetching** - Keeps data fresh
- **Loading states** - Built-in loading indicators
- **Error handling** - Automatic retry on failures
- **DevTools** - Install `@tanstack/react-query-devtools` for debugging

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure your backend allows requests from `http://localhost:3000`:

```java
// Spring Boot CORS configuration
@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Images Not Loading
- Verify images exist in `public/landscape/` and `public/profile/`
- Check that database paths match actual filenames
- Images in `public/` folder are served at `/filename.jpg` by Next.js

### API Not Responding
- Ensure backend is running on port 8080
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify OpenAPI spec is available at `http://localhost:8080/api/openapi.json`
- Run `pnpm generate:api` to regenerate API client if backend changes

## Next Steps

Consider implementing:
1. **Error boundaries** - Graceful error handling
2. **Loading skeletons** - Better loading UX
3. **Optimistic updates** - Instant UI feedback
4. **Infinite scroll** - For large movie lists
5. **Real authentication** - User login/logout with JWT
