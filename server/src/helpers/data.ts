import { prisma } from "../../prisma/client";

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};

export const getUserRoleByUserId = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user?.role;
};

export const getOtpEmailVerification = async (otp: string) => {
  const verificationToken = await prisma.otpEmailVerification.findUnique({
    where: {
      otp,
    },
  });

  return verificationToken;
};

export const getOtpEmailVerificationById = async (userId: string) => {
  const verificationToken = await prisma.otpEmailVerification.findUnique({
    where: {
      userId,
    },
  });

  return verificationToken;
};

export const getUserCount = async () => {
  const count = await prisma.user.count();
  return count;
};
