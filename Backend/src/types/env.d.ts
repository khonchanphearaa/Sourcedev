declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            MONGODB_URI: string;
            JWT_SECRET: string;
            JWT_EXPIRES_IN: string;
            CLIENT_URL: string;
        }
    }
}

export { };