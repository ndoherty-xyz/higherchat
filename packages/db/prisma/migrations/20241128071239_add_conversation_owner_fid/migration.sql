/*
  Warnings:

  - Added the required column `conversation_owner_fid` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "conversation_owner_fid" INTEGER NOT NULL;
