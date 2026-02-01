# Supabase Edge Functions

This directory contains the Edge Functions for the Pop Playground application.

## Functions

### 1. `notify-telegram`
Sends notification to Telegram Admin Group when a new order is placed or a slip is uploaded.

### 2. `send-order-email`
Sends an order confirmation email to the customer using Resend.

## Deployment

To deploy these functions, you need to use the Supabase CLI.

### Prerequisites
- Supabase CLI installed
- Logged in to Supabase (`npx supabase login`)
- Link your project (if not already linked)

### Deploy Commands

You can deploy functions individually:

```bash
# Deploy notify-telegram
npx supabase functions deploy notify-telegram --no-verify-jwt

# Deploy send-order-email
npx supabase functions deploy send-order-email --no-verify-jwt
```

**Note:** The `--no-verify-jwt` flag is important because these functions are called via `supabase-js` client or internal triggers that might not always have a standard user JWT, or we want to allow public access (controlled by logic inside). *However, for security, `send-order-email` usually requires Service Role key if called from client with RLS, but here we are simplifying based on previous manual fixes.*

## Environment Variables

Make sure you have set the following secrets in your Supabase Dashboard > Edge Functions > Secrets:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `RESEND_API_KEY`
