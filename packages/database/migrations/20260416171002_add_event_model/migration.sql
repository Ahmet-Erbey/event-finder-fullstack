-- CreateEnum
CREATE TYPE "event_type" AS ENUM ('CONCERT', 'FESTIVAL', 'THEATER', 'SPORTS', 'EXHIBITION', 'COMEDY');

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(512) NOT NULL,
    "description" TEXT NOT NULL,
    "type" "event_type" NOT NULL,
    "city" VARCHAR(128) NOT NULL,
    "venue" VARCHAR(512) NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "time" VARCHAR(16) NOT NULL,
    "image_url" VARCHAR(2048) NOT NULL,
    "price" INTEGER,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_city_idx" ON "events"("city");

-- CreateIndex
CREATE INDEX "events_type_idx" ON "events"("type");

-- CreateIndex
CREATE INDEX "events_event_date_idx" ON "events"("event_date");
