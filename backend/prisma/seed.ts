import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@linktree.app" },
    update: {},
    create: {
      email: "demo@linktree.app",
      password: hashedPassword,
      username: "demo",
      profile: {
        create: {
          displayName: "Demo User",
          bio: "Full-stack developer & digital creator. Building things on the internet.",
          templateSlug: "minimalist",
          links: {
            create: [
              {
                title: "My Portfolio",
                url: "https://example.com",
                icon: "globe",
                order: 0,
              },
              {
                title: "GitHub",
                url: "https://github.com",
                icon: "github",
                order: 1,
              },
              {
                title: "YouTube Channel",
                url: "https://youtube.com",
                icon: "youtube",
                order: 2,
              },
            ],
          },
          socials: {
            create: [
              { platform: "twitter", url: "https://twitter.com" },
              { platform: "instagram", url: "https://instagram.com" },
            ],
          },
        },
      },
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create glassmorphism demo user
  const user2 = await prisma.user.upsert({
    where: { email: "glass@linktree.app" },
    update: {},
    create: {
      email: "glass@linktree.app",
      password: hashedPassword,
      username: "glassuser",
      profile: {
        create: {
          displayName: "Glass Designer",
          bio: "UI/UX Designer who loves glassmorphism and modern aesthetics.",
          templateSlug: "glassmorphism",
          links: {
            create: [
              {
                title: "Design Portfolio",
                url: "https://dribbble.com",
                icon: "palette",
                order: 0,
              },
              {
                title: "Behance",
                url: "https://behance.net",
                icon: "layers",
                order: 1,
              },
            ],
          },
        },
      },
    },
  });

  console.log(`✅ Created user: ${user2.email}`);

  // Create cyberpunk demo user
  const user3 = await prisma.user.upsert({
    where: { email: "cyber@linktree.app" },
    update: {},
    create: {
      email: "cyber@linktree.app",
      password: hashedPassword,
      username: "cyberpunk",
      profile: {
        create: {
          displayName: "CyberDev_404",
          bio: "Hacker. Builder. Breaker of things. Living in the matrix.",
          templateSlug: "cyberpunk",
          links: {
            create: [
              {
                title: "Terminal Blog",
                url: "https://dev.to",
                icon: "terminal",
                order: 0,
              },
              {
                title: "GitHub Repos",
                url: "https://github.com",
                icon: "github",
                order: 1,
              },
              {
                title: "Discord Server",
                url: "https://discord.com",
                icon: "message-circle",
                order: 2,
              },
            ],
          },
        },
      },
    },
  });

  console.log(`✅ Created user: ${user3.email}`);
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
