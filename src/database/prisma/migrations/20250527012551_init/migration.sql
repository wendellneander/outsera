-- CreateTable
CREATE TABLE "movies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "winner" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "producers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "studios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "movie_producers" (
    "movieId" INTEGER NOT NULL,
    "producerId" INTEGER NOT NULL,

    PRIMARY KEY ("movieId", "producerId"),
    CONSTRAINT "movie_producers_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "movie_producers_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "producers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "movie_studios" (
    "movieId" INTEGER NOT NULL,
    "studioId" INTEGER NOT NULL,

    PRIMARY KEY ("movieId", "studioId"),
    CONSTRAINT "movie_studios_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "movie_studios_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "studios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "producers_name_key" ON "producers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "studios_name_key" ON "studios"("name");
