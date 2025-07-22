
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to parse command line arguments
const getArg = (argName: string): string | undefined => {
  const argIndex = process.argv.indexOf(argName);
  if (argIndex > -1) {
    return process.argv[argIndex + 1];
  }
  return undefined;
};

async function main() {
  console.log('Start seeding...');

  const email = getArg('--email');
  const password = getArg('--password');
  const roleArg = getArg('--role')?.toUpperCase();

  // If arguments are provided, use them to create a user
  if (email && password && roleArg) {
    if (!(roleArg in UserRole)) {
      throw new Error(`Invalid role specified. Must be one of ${Object.keys(UserRole).join(', ')}`);
    }
    
    const role = roleArg as UserRole;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log(`User with email ${email} already exists. Aborting.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: role === 'SUPERADMIN' ? 'Super' : 'Admin',
        lastName: 'User',
        role: role,
      },
    });
    console.log(`Successfully created user ${email} with role ${role}.`);

  } else {
    // Fallback to original behavior: create SUPERADMIN from .env
    console.log('No arguments provided. To create a user, run the script with --email, --password, and --role arguments.');
    console.log('Example: npm run create-user -- --email user@example.com --password "your-password" --role ADMIN');
    console.log('Attempting to create SUPERADMIN from .env file as a fallback...');
    
    const superAdminEmail = process.env.SUPERADMIN_EMAIL;
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD;

    if (!superAdminEmail || !superAdminPassword) {
      throw new Error('SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be set in your .env file for default seeding.');
    }

    const existingAdmin = await prisma.user.findUnique({ where: { email: superAdminEmail } });
    if (existingAdmin) {
      console.log('Default superadmin already exists. Seeding not required.');
      return;
    }

    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.SUPERADMIN,
      },
    });
    console.log('Default superadmin created successfully.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
