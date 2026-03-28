# Cloudflare Email Worker

This is a serverless email service built on Cloudflare Workers. It uses a D1 Database for queuing emails and Cron Triggers to process that queue on a schedule.

## Features

- **Serverless Architecture**: Runs entirely on Cloudflare's global edge network, eliminating the need for traditional servers.
- **Queue System**: Utilizes a SQLite database (D1) to queue outgoing emails. This ensures that your API responds immediately without waiting for the email to actually send.
- **Scheduled Sending**: A Cron trigger runs automatically to process the queue in batches, which helps respect SMTP rate limits.
- **Templating**: Supports MJML and Handlebars, allowing for dynamic and responsive HTML emails.
- **Web Interface**: Includes a dashboard to view the current queue status and send test emails.

---

## Architecture Overview

1.  **API Layer**: The worker exposes a `POST /send` endpoint. When called, it validates the request data and inserts a record into the `email_queue` table in the D1 database.
2.  **Storage**: The D1 database acts as the persistent storage for all pending, sent, and failed email records.
3.  **Worker Process**: A Cron trigger is configured to run every 10 minutes.
    - It fetches a batch of pending emails from the database.
    - It compiles the necessary MJML templates and injects the provided dynamic data.
    - It sends the emails using Nodemailer via your configured SMTP provider.
    - Finally, it updates the status of each email in the database.

---

## 📧 Sending Methods

This worker uses **SMTP** (via `nodemailer`) to send emails through an external provider (e.g., Gmail, SendGrid).

### Configuration

The worker uses `wrangler.toml` for configuration and `wrangler secret` for sensitive data.

## Setup and Configuration

### Prerequisites

- Node.js (version 18 or higher)
- Wrangler CLI (install via `npm install -g wrangler`)
- A Cloudflare account

### 1. Installation

Navigate to the worker directory and install dependencies:

```bash
cd cloudflare-email-worker
npm install
```

### 2. Database Setup

You need to create the D1 database and apply the initial schema.

```bash
# Create the database
npx wrangler d1 create email-db

# Apply the schema
npx wrangler d1 execute email-db --file=./schema.sql
```

### 3. Environment Variables

You must configure your SMTP settings. **Important:** Never commit your passwords or secrets to version control.

Use Wrangler to set your secrets securely:

```bash
npx wrangler secret put MAIL_USER  # Your SMTP Username (e.g., user@gmail.com)
npx wrangler secret put MAIL_PASS  # Your SMTP Password (or App Password)
```

Update `wrangler.toml` for non-sensitive configuration:

```toml
[vars]
MAIL_HOST = "smtp.gmail.com"
MAIL_PORT = "465"
MAIL_SECURE = "true"
MAIL_FROM_NAME = "My Service"
MAIL_RATE_LIMIT = "10" # Number of emails to process per batch
```

### 4. Local Development

You can run the worker locally for testing. It will use a local SQLite file to simulate the D1 database.

```bash
npm run dev
```

Once running, you can visit `http://localhost:8787` to access the dashboard.

---

## Deployment

To deploy the worker to Cloudflare's global network, run:

```bash
npm run deploy
```

The cron trigger will automatically start running based on the schedule defined in your `wrangler.toml` file (default is every 10 minutes).

---

## API Reference

### `POST /send`

Use this endpoint to queue an email for delivery.

**Request Body:**

```json
{
  "to": "user@example.com",
  "subject": "Welcome!",
  "templateName": "welcome",
  "templateData": {
    "name": "John Doe",
    "activationLink": "https://example.com/activate"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email queued successfully. It will be sent within 10 minutes."
}
```

### `GET /health`

Returns the current system status and queue statistics.

---

## Templates

Email templates are located in `../server/src/services/notification/email/templates`. They use MJML for structure and Handlebars for dynamic data injection.

To regenerate the template cache after adding or modifying templates, run:

```bash
npm run compile-templates
```

### Available Helpers

- `{{formatDate date}}`: Formats a date string into a readable format.
- `{{formatCurrency amount}}`: Formats a number as INR currency.

---

## Troubleshooting

### Emails are not sending

1.  **Check Logs**: Run `npx wrangler tail` to see real-time logs from your worker.
2.  **Check Queue**: Visit your worker's URL to view the dashboard and see if emails are stuck in the "pending" or "failed" state.
3.  **Authentication Errors**: Verify that `MAIL_USER` and `MAIL_PASS` are correct. If using Gmail, ensure you are using an App Password, not your login password.
4.  **Timeouts**: Cloudflare workers have CPU time limits. If you are sending too many emails at once, try reducing the `MAIL_RATE_LIMIT`.

### Template Errors

- Verify that the JSON structure in `templateData` matches what the template expects.
- If you added a new template, remember to run `npm run build` or `npm run compile-templates` before deploying.
