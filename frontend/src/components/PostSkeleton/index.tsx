import { Box, Skeleton } from '@mui/material';

const PostSkeleton = () => {
  return (
    <Box flex={4} sx={{ padding: 2, border: '1px solid #ddd', borderRadius: '8px', marginBottom: 2 }}>
      <Skeleton variant="text" width="60%" height={30} />
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ marginTop: 2 }} />
    </Box>
  );
};

export default PostSkeleton;
