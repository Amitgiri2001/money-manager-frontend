# Money Manager Frontend

React + Vite frontend for the Spring Boot Money Manager backend.

## Stack

- React + Vite + TypeScript
- Material UI for application UI
- Axios for HTTP
- React Router for page routing
- React Hook Form + Zod for form state and validation

## Folder Structure

```text
src/
  api/                 Backend integration modules and Axios client
  components/          Shared layout and reusable UI
  features/            Feature-specific components
  hooks/               Small reusable hooks
  pages/               Route-level screens
  types/               DTOs matching backend responses
  utils/               Formatting and date helpers
```

## Backend Integration

The API layer unwraps the backend `ApiResponse<T>` shape and normalizes errors into
one frontend `ApiError` shape. Feature pages do not call Axios directly.

Transactions use Spring pagination query params:

```text
page=0&size=10&sort=time,desc&type=EXPENSE&category=FOOD&keyword=lunch
```

Voice transactions follow the backend's two-step workflow:

1. `POST /api/voice/parse/{userId}` with a raw text body.
2. Review `ParsedTransaction`.
3. `POST /api/voice/confirm` with `confirmationId` and `confirmed`.

## Environment

Create `.env` from `.env.example` when needed:

```text
VITE_API_BASE_URL=http://localhost:8081
```
