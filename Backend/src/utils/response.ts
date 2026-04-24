import { Response } from 'express';

export const sendResponse = (
    res: Response,
    status: number,
    message: string,
    data: any = null
) => {
    const response: any = {
        success: status < 400,
        message,
    };

    // Only add the data key if data is actually provided   
    if (data !== null) {
        response.data = data;
    }

    res.status(status).json(response);
};