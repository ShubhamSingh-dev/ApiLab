-- CreateTable
CREATE TABLE "public"."RequestRun" (
    "id" TEXT NOT NULL,
    "status" INTEGER,
    "statusText" TEXT,
    "headers" JSONB,
    "body" JSONB,
    "duration" INTEGER,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestRun_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."RequestRun" ADD CONSTRAINT "RequestRun_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
