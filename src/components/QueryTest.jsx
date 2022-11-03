import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query';

const QueryTest = ({ reqLink }) => {
    const { isLoading, error, data } = useQuery(['repoData', reqLink], () =>
        fetch(reqLink).then((res, req) => res.json())
    );
    if (isLoading) return 'Loading...';
    if (error) return 'An error has occurred: ' + error.message;
    else return <div>from react query: {data?.name}</div>;
};

export default QueryTest;
