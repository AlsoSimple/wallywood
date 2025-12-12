import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface UserRow {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  isActive: string;
}

interface GenreRow {
  id: string;
  title: string;
  slug: string;
}

interface PosterRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  width: string;
  height: string;
  price: string;
  stock: string;
}

interface GenrePosterRelRow {
  genreId: string;
  posterId: string;
}

interface UserRatingRow {
  id: string;
  userId: string;
  posterId: string;
  numStars: string;
}

interface CartlineRow {
  userId: string;
  posterId: string;
  quantity: string;
}

async function readCSV<T>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: T) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.userRating.deleteMany();
  await prisma.cartline.deleteMany();
  await prisma.genrePosterRel.deleteMany();
  await prisma.user.deleteMany();
  await prisma.poster.deleteMany();
  await prisma.genre.deleteMany();

  // Seed Genres
  console.log('Seeding genres...');
  const genreRows = await readCSV<GenreRow>(path.join(__dirname, '../_FILES/csv/genre.csv'));
  for (const row of genreRows) {
    await prisma.genre.create({
      data: {
        id: parseInt(row.id),
        title: row.title,
        slug: row.slug,
      },
    });
  }
  console.log(`Created ${genreRows.length} genres`);

  // Seed Posters
  console.log('Seeding posters...');
  const posterRows = await readCSV<PosterRow>(path.join(__dirname, '../_FILES/csv/poster.csv'));
  let posterCount = 0;
  for (const row of posterRows) {
    // Generate slug if empty
    const slug = row.slug && row.slug.trim() !== '' 
      ? row.slug 
      : row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + row.id;
    
    await prisma.poster.create({
      data: {
        id: parseInt(row.id),
        name: row.name,
        slug,
        description: row.description,
        image: row.image,
        width: parseInt(row.width),
        height: parseInt(row.height),
        price: parseFloat(row.price),
        stock: parseInt(row.stock),
      },
    });
    posterCount++;
  }
  console.log(`Created ${posterCount} posters`);

  // Seed Users
  console.log('Seeding users...');
  const userRows = await readCSV<UserRow>(path.join(__dirname, '../_FILES/csv/user.csv'));
  for (const row of userRows) {
    // Hash the password - using a simple default password for demo
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await prisma.user.create({
      data: {
        id: parseInt(row.id),
        firstname: row.firstname,
        lastname: row.lastname,
        email: row.email,
        password: hashedPassword,
        role: row.role as any,
        isActive: row.isActive === 'true' || row.isActive === '1',
      },
    });
  }
  console.log(`Created ${userRows.length} users`);

  // Seed Genre-Poster Relations
  console.log('Seeding genre-poster relations...');
  const genrePosterRelRows = await readCSV<GenrePosterRelRow>(
    path.join(__dirname, '../_FILES/csv/genrePosterRel.csv')
  );
  for (const row of genrePosterRelRows) {
    await prisma.genrePosterRel.create({
      data: {
        genreId: parseInt(row.genreId),
        posterId: parseInt(row.posterId),
      },
    });
  }
  console.log(`Created ${genrePosterRelRows.length} genre-poster relations`);

  // Seed User Ratings
  console.log('Seeding user ratings...');
  const userRatingRows = await readCSV<UserRatingRow>(
    path.join(__dirname, '../_FILES/csv/userRatings.csv')
  );
  for (const row of userRatingRows) {
    await prisma.userRating.create({
      data: {
        id: parseInt(row.id),
        userId: parseInt(row.userId),
        posterId: parseInt(row.posterId),
        numStars: parseInt(row.numStars),
      },
    });
  }
  console.log(`Created ${userRatingRows.length} user ratings`);

  // Seed Cartlines
  console.log('Seeding cartlines...');
  const cartlineRows = await readCSV<CartlineRow>(
    path.join(__dirname, '../_FILES/csv/cartlines.csv')
  );
  for (const row of cartlineRows) {
    await prisma.cartline.create({
      data: {
        userId: parseInt(row.userId),
        posterId: parseInt(row.posterId),
        quantity: parseInt(row.quantity),
      },
    });
  }
  console.log(`Created ${cartlineRows.length} cartlines`);

  console.log('Database seeded successfully!');
  console.log('\nDefault login credentials:');
  console.log('   Email: info@webudvikler.dk');
  console.log('   Password: password');
  console.log('   Role: ADMIN');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
