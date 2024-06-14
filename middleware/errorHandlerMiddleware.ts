import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (
    err: { stack: any; statusCode: StatusCodes; message: string },
    req: any,
    res: { status: (arg0: any) => { (): any; new (): any; json: { (arg0: { msg: any }): void; new (): any } } },
    next: any,
) => {
    console.log(err.stack)

    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    const msg = err.message || 'Something went wrong, please try again later'
    res.status(statusCode).json({ msg })
}

export default errorHandlerMiddleware
