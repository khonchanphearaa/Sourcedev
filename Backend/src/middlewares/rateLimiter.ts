import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { 
    success: false, 
    message: 'Too many requests from this IP, please try again after 15 minutes.' 
  },
});

// Stricter limiter for Auth/OTP routes to prevent brute force
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour
  message: { 
    success: false, 
    message: 'Too many login or OTP attempts. Please try again in 1hour.' 
  },
});