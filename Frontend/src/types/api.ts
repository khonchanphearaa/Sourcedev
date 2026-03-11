export interface ApiErrorResponse {
    response: {
        success: boolean,
        data?: {
            message?: string
        }
    }
}