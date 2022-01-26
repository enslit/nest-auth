/*
  Warnings:

  - The primary key for the `tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `host` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens"
    DROP CONSTRAINT "tokens_pkey",
    ADD COLUMN "host" TEXT NOT NULL,
    ADD COLUMN "ip"   TEXT NOT NULL,
    ALTER COLUMN "id" DROP DEFAULT,
    ALTER COLUMN "id" SET DATA TYPE TEXT,
    ADD CONSTRAINT "tokens_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tokens_id_seq";
