import { Form, redirect, useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import { FormRow, FormRowSelect, SubmitBtn } from '../components'
import customFetch from '../utils/customFetch'

export const JOB_STATUS = {
    PENDING: 'pending',
    INTERVIEW: 'interview',
    DECLINED: 'declined',
}

export const JOB_TYPE = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    INTERNSHIP: 'internship',
}

export const JOB_SORT_BY = {
    NEWEST_FIRST: 'newest',
    OLDEST_FIRST: 'oldest',
    ASCENDING: 'a-z',
    DESCENDING: 'z-a',
}

export const loader = async ({ params }) => {
    try {
        const { data } = await customFetch.get(`/jobs/${params.id}`)
        return data
    } catch (error) {
        toast.error(error?.response?.data?.msg)
        return redirect('/dashboard/all-jobs')
    }
}

export const action =
    (queryClient) =>
    async ({ request, params }) => {
        const formData = await request.formData()
        const data = Object.fromEntries(formData)
        try {
            await customFetch.patch(`/jobs/${params.id}`, data)
            queryClient.invalidateQueries(['jobs'])
            toast.success('Job edited successfully')
            return redirect('/dashboard/all-jobs')
        } catch (error) {
            toast.error(error?.response?.data?.msg)
            return error
        }
    }

const EditJob = () => {
    // @ts-expect-error - params is not defined
    const { job } = useLoaderData()

    return (
        <Wrapper>
            <Form method='post' className='form'>
                <h4 className='form-title'>edit job</h4>
                <div className='form-center'>
                    <FormRow type='text' name='position' defaultValue={job?.position} />
                    <FormRow type='text' name='company' defaultValue={job?.company} />
                    <FormRow
                        type='text'
                        name='jobLocation'
                        defaultValue={job?.jobLocation}
                        labelText={'job location'}
                    />
                    <FormRowSelect
                        name={'jobStatus'}
                        labelText={'job status'}
                        defaultValue={job?.jobStatus}
                        list={Object.values(JOB_STATUS)}
                    />
                    <FormRowSelect
                        name={'jobType'}
                        labelText={'job type'}
                        defaultValue={job?.jobType}
                        list={Object.values(JOB_TYPE)}
                    />
                    <SubmitBtn formBtn />
                </div>
            </Form>
        </Wrapper>
    )
}

export default EditJob
