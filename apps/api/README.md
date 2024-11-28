# Telescope API

GraphQL API server for Telescope.

## Features

- GraphQL API using Pothos
- Authentication with Lucia
- File uploads to S3
- Stripe integration for payments
- Email sending with Resend

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## GraphQL Schema

The GraphQL schema is built using Pothos and is organized by domain:

- `/src/graphql/endpoints/collections/` - Collection-related queries and mutations
- `/src/graphql/endpoints/entries/` - Entry-related queries and mutations
- `/src/graphql/endpoints/users/` - User-related queries and mutations
- `/src/graphql/endpoints/stripe/` - Stripe payment queries and mutations

## Environment Variables

See the root README for required environment variables.

## API Routes

- `/api/graphql` - GraphQL endpoint
- `/login` - Email login endpoint
- `/validate-login` - Login validation endpoint
- `/image-upload` - Image upload endpoint
- `/stripe/webhook/subscriptions` - Stripe webhook endpoint
