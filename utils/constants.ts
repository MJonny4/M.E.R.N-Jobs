export enum JobStatus {
    PENDING = "pending",
    INTERVIEW = "interview",
    DECLINED = "declined",
}

export enum JobType {
    FULL_TIME = "full-time",
    PART_TIME = "part-time",
    INTERNSHIP = "internship",
}

export enum JobSortBy {
    NEWEST_FIRST = "newest",
    OLDEST_FIRST = "oldest",
    ASCENDING = "a-z",
    DESCENDING = "z-a",
}

export interface IMonthlyApplication {
    _id: {
        year: number;
        month: number;
    };
    count: number;
    date: string;
}