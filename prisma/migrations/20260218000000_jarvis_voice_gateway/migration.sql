-- Create enums
CREATE TYPE "VoiceCallStatus" AS ENUM ('INITIATED', 'ANSWERED', 'IN_PROGRESS', 'ENDED', 'FAILED');
CREATE TYPE "HitlActionType" AS ENUM ('SEND_BOOKING_LINK');
CREATE TYPE "HitlRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SENT', 'FAILED');

-- Create tables
CREATE TABLE "Lead" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "company" TEXT,
  "role" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "useCase" TEXT,
  "budgetRange" TEXT,
  "timeline" TEXT,
  "source" TEXT,
  "notes" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VoiceCall" (
  "id" TEXT NOT NULL,
  "externalCallControlId" TEXT NOT NULL,
  "externalCallLegId" TEXT,
  "externalCallSessionId" TEXT,
  "status" "VoiceCallStatus" NOT NULL DEFAULT 'INITIATED',
  "fromNumber" TEXT,
  "toNumber" TEXT,
  "startedAt" TIMESTAMP(3),
  "endedAt" TIMESTAMP(3),
  "durationSeconds" INTEGER,
  "assistantId" TEXT,
  "conversationId" TEXT,
  "rawLastEvent" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "leadId" TEXT,
  CONSTRAINT "VoiceCall_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VoiceWebhookEvent" (
  "id" TEXT NOT NULL,
  "externalEventId" TEXT,
  "eventType" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL,
  "processingStatus" TEXT NOT NULL DEFAULT 'RECEIVED',
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "voiceCallId" TEXT,
  CONSTRAINT "VoiceWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HitlRequest" (
  "id" TEXT NOT NULL,
  "actionType" "HitlActionType" NOT NULL,
  "status" "HitlRequestStatus" NOT NULL DEFAULT 'PENDING',
  "destinationPhone" TEXT NOT NULL,
  "smsBody" TEXT NOT NULL,
  "bookingUrl" TEXT NOT NULL,
  "requestedBy" TEXT,
  "requestPayload" JSONB,
  "approvedBy" TEXT,
  "approvedAt" TIMESTAMP(3),
  "rejectedBy" TEXT,
  "rejectedAt" TIMESTAMP(3),
  "rejectionReason" TEXT,
  "sentAt" TIMESTAMP(3),
  "failedAt" TIMESTAMP(3),
  "telnyxMessageId" TEXT,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "leadId" TEXT,
  "voiceCallId" TEXT,
  CONSTRAINT "HitlRequest_pkey" PRIMARY KEY ("id")
);

-- Unique constraints
CREATE UNIQUE INDEX "VoiceCall_externalCallControlId_key" ON "VoiceCall" ("externalCallControlId");
CREATE UNIQUE INDEX "VoiceWebhookEvent_externalEventId_key" ON "VoiceWebhookEvent" ("externalEventId");

-- Indexes
CREATE INDEX "Lead_email_idx" ON "Lead" ("email");
CREATE INDEX "Lead_phone_idx" ON "Lead" ("phone");
CREATE INDEX "Lead_createdAt_idx" ON "Lead" ("createdAt");

CREATE INDEX "VoiceCall_externalCallLegId_idx" ON "VoiceCall" ("externalCallLegId");
CREATE INDEX "VoiceCall_externalCallSessionId_idx" ON "VoiceCall" ("externalCallSessionId");
CREATE INDEX "VoiceCall_status_idx" ON "VoiceCall" ("status");

CREATE INDEX "VoiceWebhookEvent_eventType_idx" ON "VoiceWebhookEvent" ("eventType");
CREATE INDEX "VoiceWebhookEvent_processingStatus_idx" ON "VoiceWebhookEvent" ("processingStatus");

CREATE INDEX "HitlRequest_status_idx" ON "HitlRequest" ("status");
CREATE INDEX "HitlRequest_actionType_idx" ON "HitlRequest" ("actionType");
CREATE INDEX "HitlRequest_createdAt_idx" ON "HitlRequest" ("createdAt");

-- Foreign keys
ALTER TABLE "VoiceCall"
ADD CONSTRAINT "VoiceCall_leadId_fkey"
FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "VoiceWebhookEvent"
ADD CONSTRAINT "VoiceWebhookEvent_voiceCallId_fkey"
FOREIGN KEY ("voiceCallId") REFERENCES "VoiceCall"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "HitlRequest"
ADD CONSTRAINT "HitlRequest_leadId_fkey"
FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "HitlRequest"
ADD CONSTRAINT "HitlRequest_voiceCallId_fkey"
FOREIGN KEY ("voiceCallId") REFERENCES "VoiceCall"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
