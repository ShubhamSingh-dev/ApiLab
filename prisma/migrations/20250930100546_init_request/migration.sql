-- CreateEnum
CREATE TYPE "public"."REST_METHOD" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH');

-- CreateTable
CREATE TABLE "public"."Request" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "method" "public"."REST_METHOD" NOT NULL DEFAULT 'GET',
    "url" TEXT NOT NULL,
    "parameters" JSONB,
    "headers" JSONB,
    "body" JSONB,
    "response" JSONB,
    "collectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Request" ADD CONSTRAINT "Request_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
