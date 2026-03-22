import * as crypto from 'crypto';

export const generateOTP = (): string => {
    try {
        const otp = crypto.randomInt(1000, 10000).toString();
        return otp;
    } catch (error) {
        throw new Error('Failed to generate OTP');
    }
}

export const generateAlphaNumericOTP = (length: number = 4): string => {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
