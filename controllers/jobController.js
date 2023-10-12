import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customError.js";
import day from "dayjs";

import Job from "../models/jobModel.js";

export const getAllJobs = async (req, res) => {
    const { search, jobStatus, jobType, sort } = req.query;

    const queryObject = {
        createdBy: new ObjectId(req.user.userId),
    };

    if (search) {
        queryObject.$or = [
            {
                position: { $regex: search, $options: "i" },
            },
            {
                company: { $regex: search, $options: "i" },
            },
        ];
    }

    if (jobStatus && jobStatus !== "all") {
        queryObject.jobStatus = jobStatus;
    }

    if (jobType && jobType !== "all") {
        queryObject.jobType = jobType;
    }

    const sortOptions = {
        newest: "-createdAt",
        oldest: "createdAt",
        "a-z": "position",
        "z-a": "-position",
    };

    const sortKey = sortOptions[sort] || sortOptions.newest;

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find(queryObject)
        .sort(sortKey)
        .skip(skip)
        .limit(limit);
    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(StatusCodes.OK).json({
        totalJobs,
        numOfPages,
        currentPage: page,
        jobs,
    });
};

export const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};

export const getJob = async (req, res) => {
    const job = await Job.findById(new ObjectId(req.params.id));
    res.status(StatusCodes.OK).json({ job });
};

export const updateJob = async (req, res) => {
    const updatedJob = await Job.findByIdAndUpdate(
        new ObjectId(req.params.id),
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(StatusCodes.OK).json({ job: updatedJob });
};

export const deleteJob = async (req, res) => {
    const deletedJob = await Job.findByIdAndDelete(new ObjectId(req.params.id));

    res.status(StatusCodes.OK).json({
        msg: "Job deleted successfully",
        job: deletedJob,
    });
};

export const showStats = async (req, res) => {
    let stats = await Job.aggregate([
        {
            $match: {
                createdBy: new ObjectId(req.user.userId),
            },
        },
        {
            $group: {
                _id: "$jobStatus",
                count: { $sum: 1 },
            },
        },
    ]);

    stats = stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
    }, {});

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
    };

    let monthlyApplications = await Job.aggregate([
        {
            $match: {
                createdBy: new ObjectId(req.user.userId),
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                "_id.year": -1,
                "_id.month": -1,
            },
        },
        {
            $limit: 6,
        },
    ]);

    monthlyApplications = monthlyApplications
        .map((item) => {
            const {
                _id: { year, month },
                count,
            } = item;

            const date = day()
                .month(month - 1)
                .year(year)
                .format("MMM YY");
            return { date, count };
        })
        .reverse();

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
