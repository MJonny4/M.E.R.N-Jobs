import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
const AllJobsContext = createContext(null);

const allJobsQuery = (params) => {
    const { search, jobStatus, jobType, sort, page } = params;
    return {
        queryKey: [
            'jobs',
            search ?? '',
            jobStatus ?? 'all',
            jobType ?? 'all',
            sort ?? 'newest',
            page ?? 1,
        ],
        queryFn: async () => {
            const { data } = await customFetch.get('/jobs', {
                params,
            });
            return data;
        },
    };
};

export const loader =
    (queryClient) =>
    async ({ request }) => {
        const params = Object.fromEntries([
            ...new URL(request.url).searchParams.entries(),
        ]);

        await queryClient.ensureQueryData(allJobsQuery(params));
        return { searchValues: { ...params } };
    };

const AllJobs = () => {
    // @ts-expect-error - params is not defined
    const { searchValues }: { searchValues: string } = useLoaderData();
    const { data } = useQuery(allJobsQuery(searchValues));
    return (
        <AllJobsContext.Provider value={{ data, searchValues }}>
            <SearchContainer />
            <JobsContainer />
        </AllJobsContext.Provider>
    );
};
export default AllJobs;

export const useAllJobsContext = () => useContext(AllJobsContext);
