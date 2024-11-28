-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMessages" (
    "id" TEXT NOT NULL,
    "castHash" TEXT NOT NULL,
    "message_text" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "conversation_id" TEXT NOT NULL,

    CONSTRAINT "UserMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AetherMessages" (
    "id" TEXT NOT NULL,
    "castHash" TEXT NOT NULL,
    "message_text" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "conversation_id" TEXT NOT NULL,

    CONSTRAINT "AetherMessages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMessages_castHash_key" ON "UserMessages"("castHash");

-- CreateIndex
CREATE UNIQUE INDEX "AetherMessages_castHash_key" ON "AetherMessages"("castHash");

-- AddForeignKey
ALTER TABLE "UserMessages" ADD CONSTRAINT "UserMessages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AetherMessages" ADD CONSTRAINT "AetherMessages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
