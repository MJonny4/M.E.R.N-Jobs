import { Schema, model, Types, Document } from 'mongoose'
export enum EJobStatus {
    PENDING = 'pending',
    INTERVIEW = 'interview',
    DECLINED = 'declined',
}

export enum EJobType {
    FULL_TIME = 'full-time',
    PART_TIME = 'part-time',
    INTERNSHIP = 'internship',
}

export enum JobSortBy {
    NEWEST_FIRST = 'newest',
    OLDEST_FIRST = 'oldest',
    ASCENDING = 'a-z',
    DESCENDING = 'z-a',
}
export interface IJob extends Document {
    company: string
    position: string
    jobStatus: string
    jobType: string
    jobLocation: string
    createdBy: Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const JobSchema = new Schema<IJob>(
    {
        company: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            required: true,
        },
        jobStatus: {
            type: String,
            enum: Object.values(EJobStatus),
            default: EJobStatus.PENDING,
        },
        jobType: {
            type: String,
            enum: Object.values(EJobType),
            default: EJobType.FULL_TIME,
        },
        jobLocation: {
            type: String,
            default: 'my city',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true },
)

export default model<IJob>('Job', JobSchema)
