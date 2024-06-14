import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import mongoose, { Types } from 'mongoose'
import dayjs from 'dayjs'
import Job, { IJob } from '../models/jobModel'

// Get all jobs
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
    const { search, jobStatus, jobType, sort } = req.query

    const queryObject: any = {
        createdBy: (req as any).user.userId,
    }

    if (search) {
        queryObject.$or = [
            { position: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
        ]
    }

    if (jobStatus && jobStatus !== 'all') {
        queryObject.jobStatus = jobStatus
    }

    if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType
    }

    const sortOptions: { [key: string]: string } = {
        newest: '-createdAt',
        oldest: 'createdAt',
        'a-z': 'position',
        'z-a': '-position',
    }

    const sortKey = sortOptions[sort as string] || sortOptions.newest

    // Pagination
    const page: number = Number(req.query.page) || 1
    const limit: number = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const jobs: IJob[] = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit)
    const totalJobs: number = await Job.countDocuments(queryObject)
    const numOfPages: number = Math.ceil(totalJobs / limit)

    res.status(StatusCodes.OK).json({
        totalJobs,
        numOfPages,
        currentPage: page,
        jobs,
    })
}

// Create a new job
export const createJob = async (req: Request, res: Response): Promise<void> => {
    req.body.createdBy = new Types.ObjectId((req as any).user.userId)
    const job: IJob = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

// Get a single job by ID
export const getJob = async (req: Request, res: Response): Promise<void> => {
    const job: IJob | null = await Job.findById((req as any).params.id)
    res.status(StatusCodes.OK).json({ job })
}

// Update a job by ID
export const updateJob = async (req: Request, res: Response): Promise<void> => {
    const updatedJob: IJob | null = await Job.findByIdAndUpdate((req as any).params.id, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(StatusCodes.OK).json({ job: updatedJob })
}

// Delete a job by ID
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
    const deletedJob = await Job.findByIdAndDelete(new Types.ObjectId(req.params.id))

    res.status(StatusCodes.OK).json({
        msg: 'Job deleted successfully',
        job: deletedJob,
    })
}

// Show job statistics
export const showStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId

        if (!Types.ObjectId.isValid(userId)) {
            res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid user ID' })
            return
        }

        const jobs = await Job.find({ createdBy: new Types.ObjectId(userId) })

        if (jobs.length > 0) {
            let stats = await Job.aggregate([
                {
                    $match: { createdBy: new Types.ObjectId(userId) },
                },
                {
                    $group: {
                        _id: '$jobStatus',
                        count: { $sum: 1 },
                    },
                },
            ])

            stats = stats.reduce((acc, curr) => {
                acc[curr._id] = curr.count
                return acc
            }, {})

            const defaultStats = {
                //@ts-expect-error
                pending: stats.pending || 0,
                //@ts-expect-error
                interview: stats.interview || 0,
                //@ts-expect-error
                declined: stats.declined || 0,
            }

            let monthlyApplications = await Job.aggregate([
                {
                    $match: { createdBy: new Types.ObjectId(userId) },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        '_id.year': -1,
                        '_id.month': -1,
                    },
                },
                {
                    $limit: 6,
                },
            ])

            monthlyApplications = monthlyApplications
                .map((item) => {
                    const {
                        _id: { year, month },
                        count,
                    } = item

                    const date = dayjs()
                        .month(month - 1)
                        .year(year)
                        .format('MMM YY')
                    return { date, count }
                })
                .reverse()

            res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
        } else {
            res.status(StatusCodes.OK).json({ defaultStats: {}, monthlyApplications: [] })
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Error fetching stats' })
    }
}
