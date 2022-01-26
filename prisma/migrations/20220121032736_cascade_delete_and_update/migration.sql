-- DropForeignKey
ALTER TABLE "profiles"
    DROP CONSTRAINT "profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "tokens"
    DROP CONSTRAINT "tokens_userId_fkey";

-- AddForeignKey
ALTER TABLE "profiles"
    ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens"
    ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
