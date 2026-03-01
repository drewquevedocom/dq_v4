# Jarvis Voice Gateway

PSTN-first Telnyx voice assistant for qualifying leads, gating booking-link SMS with HITL approval, and managing approvals from Mission Control.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment template and fill values:

```bash
cp .env.example .env.local
```

3. Generate Prisma client and run migrations (Supabase Postgres):

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Bootstrap or update the Telnyx AI assistant:

```bash
npm run telnyx:assistant:bootstrap
```

5. Start the app:

```bash
npm run dev
```

## Deploy on Cloudflare Workers

This project is configured for OpenNext on Cloudflare Workers.

1. Install dependencies:

```bash
npm install
```

2. Authenticate Wrangler:

```bash
npx wrangler login
```

For CI/non-interactive shells, set:

`CLOUDFLARE_API_TOKEN=<token>`

3. Deploy:

```bash
npm run deploy
```

4. Local Worker preview (uses `.dev.vars`):

```bash
cp .dev.vars.example .dev.vars
npm run preview
```

5. Bulk set secrets from file:

```bash
cp .env.cloudflare.staging.example .env.cloudflare.staging
npm run cf:secrets -- --file .env.cloudflare.staging
```

## Key Endpoints

- `POST /api/voice/incoming`
- `POST /api/voice/tools/check-calendar-availability`
- `POST /api/voice/tools/send-booking-link`
- `POST /api/admin/auth/login`
- `GET /api/admin/hitl/requests?status=pending`
- `POST /api/admin/hitl/requests/:id/approve`
- `POST /api/admin/hitl/requests/:id/reject`
- `POST /api/webhooks/instantly`

## Growth Engine

- Server action: `sendLeadMagnet(email)` in `src/app/actions/sendLeadMagnet.ts` (Resend + Jesper-branded React Email template).
- Cold injection helper: `injectIntoInstantly(lead)` in `src/lib/instantly.ts`.
- Voice flow: unbooked Jarvis calls are injected into Instantly (`/api/v2/leads/add`) with `custom_variable.source = "jarvis_chat"`.
- Instantly webhook: "Reply Received" events trigger a simplified Telnyx SMS alert to `DREW_ALERT_PHONE`.
- Landing analytics hooks emit client events (`dq:analytics`) and forward to `dataLayer`/`gtag`/`plausible` when present.

## Cloudflare Env Vars

Set these in your Cloudflare Worker settings (`Settings -> Variables and Secrets`) or via Wrangler:

```bash
npx wrangler secret put APP_BASE_URL
npx wrangler secret put ADMIN_APPROVAL_TOKEN
npx wrangler secret put HITL_ENABLED
npx wrangler secret put BOOKING_LINK_URL
npx wrangler secret put DATABASE_URL
npx wrangler secret put DIRECT_URL
npx wrangler secret put TELNYX_API_KEY
npx wrangler secret put TELNYX_PUBLIC_KEY
npx wrangler secret put TELNYX_ASSISTANT_ID
npx wrangler secret put TELNYX_SMS_FROM_NUMBER
npx wrangler secret put TELNYX_WEBHOOK_SKIP_VERIFY
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON
npx wrangler secret put GOOGLE_CALENDAR_ID
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_FROM_EMAIL
npx wrangler secret put LEAD_MAGNET_PDF_URL
npx wrangler secret put INSTANTLY_API_KEY
npx wrangler secret put INSTANTLY_API_BASE_URL
npx wrangler secret put INSTANTLY_CAMPAIGN_ID
npx wrangler secret put INSTANTLY_WEBHOOK_SECRET
npx wrangler secret put DREW_ALERT_PHONE
npx wrangler secret put JARVIS_PSTN_NUMBER
npx wrangler secret put NEXT_PUBLIC_JARVIS_PSTN_NUMBER
npx wrangler secret put NEXT_PUBLIC_SOCIAL_WEBSITE_URL
npx wrangler secret put NEXT_PUBLIC_SOCIAL_LINKEDIN_URL
npx wrangler secret put NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL
npx wrangler secret put NEXT_PUBLIC_SOCIAL_YOUTUBE_URL
```

`JARVIS_PSTN_NUMBER` is preferred on Cloudflare because it is read at runtime by the server layout and passed to the floating call button.

## Instantly Webhook Setup

Set Instantly to call:

`POST https://<your-cloudflare-domain>/api/webhooks/instantly`

Subscribe to the `Reply Received` event and include your shared secret in:

`x-instantly-webhook-secret: <INSTANTLY_WEBHOOK_SECRET>`

## Antigravity Note

If you are mirroring this integration in Antigravity, install the Telnyx plugin there:

`/plugin install telnyx-node`

This repository itself uses the npm `telnyx` SDK directly.
