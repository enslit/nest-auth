-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "profiles"
(
    "id"        SERIAL  NOT NULL,
    "firstName" TEXT    NOT NULL,
    "lastName"  TEXT    NOT NULL,
    "userId"    INTEGER NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users"
(
    "id"        SERIAL       NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role"      "Role"       NOT NULL DEFAULT E'USER',
    "email"     TEXT         NOT NULL,
    "password"  TEXT         NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens"
(
    "id"        SERIAL       NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired"   TIMESTAMP(3) NOT NULL,
    "userId"    INTEGER      NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");

-- AddForeignKey
ALTER TABLE "profiles"
    ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens"
    ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
