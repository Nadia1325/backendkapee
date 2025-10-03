// utils/otpGenerator.ts
export const generateOTP = (length = 6): string => {
  let otp = "";
  const digits = "0123456789";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};