import { Form, Link, useSubmit } from 'react-router-dom'
import { FormRow, FormRowSelect } from '.'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import { useAllJobsContext } from '../pages/AllJobs'

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

const SearchContainer = () => {
    const { searchValues } = useAllJobsContext()
    const { search, jobStatus, jobType, sort } = searchValues
    const submit = useSubmit()

    const debounce = (onChange) => {
        let timeout
        return (e) => {
            const form = e.currentTarget.form
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                onChange(form)
            }, 1000)
        }
    }

    return (
        <Wrapper>
            <Form className='form'>
                <h5 className='form-title'>Search Form</h5>
                <div className='form-center'>
                    <FormRow
                        type={'search'}
                        name={'search'}
                        defaultValue={search}
                        onChange={debounce((form) => {
                            submit(form)
                        })}
                    />
                    <FormRowSelect
                        labelText='job stats'
                        name='jobStatus'
                        list={['all', ...Object.values(JobStatus)]}
                        defaultValue={jobStatus}
                        onChange={(e) => {
                            submit(e.currentTarget.form)
                        }}
                    />
                    <FormRowSelect
                        labelText='job type'
                        name='jobType'
                        list={['all', ...Object.values(JobType)]}
                        defaultValue={jobType}
                        onChange={(e) => {
                            submit(e.currentTarget.form)
                        }}
                    />
                    <FormRowSelect
                        name='sort'
                        defaultValue={sort}
                        list={Object.values(JobSortBy)}
                        onChange={(e) => {
                            submit(e.currentTarget.form)
                        }}
                    />
                    <Link to={`/dashboard/all-jobs`} className='btn form-btn delete-btn'>
                        Reset Search Values
                    </Link>
                </div>
            </Form>
        </Wrapper>
    )
}

export default SearchContainer
