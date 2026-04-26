export const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Usage Example with SWR:
// import useSWR from 'swr';
// import { fetcher } from '@/lib/swr-fetcher';
// const { data, error, isLoading } = useSWR('/api/candidates', fetcher);
