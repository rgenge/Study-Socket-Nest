-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "intra_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "avatar" TEXT,
    "two_factor_auth" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_auth_key" VARCHAR(255),
    "two_factor_auth_uri" VARCHAR(255),
    "code_verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_intra_name_key" ON "User"("intra_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
