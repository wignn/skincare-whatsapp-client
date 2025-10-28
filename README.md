# WhatsApp Client Service

Service untuk mengirim notifikasi WhatsApp.

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **WhatsApp Web.js** - WhatsApp Web API
- **Prisma** - ORM Database
- **Node-cron** - Scheduler untuk reminder

## Prerequisites

- Node.js >= 18.x
- npm atau yarn
- Database (sesuai dengan Prisma schema)

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Build TypeScript
npm run build
```

## Development

```bash
# Run in development mode with ts-node
npm run dev

# Run in development mode with watch mode
npm run dev:watch

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check
```

## Production

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```


## API Endpoints

### POST /api/send-message

Send WhatsApp message to a specific number.

**Headers:**

- `Content-Type: application/json`
- `x-api-key: your-api-key` (Required)

**Request Body:**

```json
{
  "number": "081234567890",
  "message": "Hello from WhatsApp Bot!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "number": "6281234567890",
    "message": "Hello from WhatsApp Bot!"
  }
}
```

**Error Responses:**

401 Unauthorized (Missing API Key):

```json
{
  "success": false,
  "message": "x-api-key header is required"
}
```

403 Forbidden (Invalid API Key):

```json
{
  "success": false,
  "message": "Invalid x-api-key"
}
```
