generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// USER
// ==========================================
model User {
  id            String    @id @default(cuid())
  username      String    @unique
  email         String    @unique
  password      String
  name          String?
  bio           String?   @db.VarChar(160)
  avatarUrl     String?
  bannerUrl     String?
  verified      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  posts         Post[]
  comments      Comment[]
  likes         Like[]

  following     Follow[]  @relation("Following")
  followers     Follow[]  @relation("Followers")

  @@index([username])
}

// ==========================================
// POST — mekanisme "Fokus Teks" (fase 1)
// mediaUrl/mediaType disiapkan untuk mekanisme "Media Konten" (fase 2)
// ==========================================
model Post {
  id            String    @id @default(cuid())
  content       String    @db.VarChar(500)
  mediaUrl      String?
  mediaType     MediaType @default(NONE)

  authorId      String
  author        User      @relation(fields: [authorId], references: [id], onDelete: Cascade)

  parentId      String?
  parent        Post?     @relation("Replies", fields: [parentId], references: [id], onDelete: Cascade)
  replies       Post[]    @relation("Replies")

  repostOfId    String?
  repostOf      Post?     @relation("Reposts", fields: [repostOfId], references: [id], onDelete: Cascade)
  reposts       Post[]    @relation("Reposts")

  likes         Like[]
  comments      Comment[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([authorId, createdAt])
  @@index([parentId])
}

enum MediaType {
  NONE
  IMAGE
  VIDEO
}

// ==========================================
// COMMENT
// ==========================================
model Comment {
  id          String   @id @default(cuid())
  content     String   @db.VarChar(500)

  postId      String
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  authorId    String
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@index([postId, createdAt])
}

// ==========================================
// LIKE
// ==========================================
model Like {
  id        String   @id @default(cuid())

  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([postId, userId])
  @@index([postId])
}

// ==========================================
// FOLLOW
// ==========================================
model Follow {
  id            String   @id @default(cuid())

  followerId    String
  follower      User     @relation("Following", fields: [followerId], references: [id], onDelete: Cascade)

  followingId   String
  followingUser User     @relation("Followers", fields: [followingId], references: [id], onDelete: Cascade)

  createdAt     DateTime @default(now())

  @@unique([followerId, followingId])
  @@index([followingId])
}
