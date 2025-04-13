import { Box } from '@mui/system';
import { Post, PostProps } from './Post';
import { getReader } from '@/services/requests';
import { useEffect, useRef, useState } from 'react';
import PostSkeleton from './PostSkeleton';

export const Feed = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(new AbortController());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const appendToPosts = (limit: number) => {
    const posts: PostProps[] = [];
    return new WritableStream({
      write(chunk) {
        if (posts.length < limit) {
          posts.push(JSON.parse(chunk));
        } else {
          setPosts(prevPosts => [...prevPosts, ...posts]);
          abortControllerRef.current.abort();
        }
      },
      abort(reason) {
        console.log('Stream aborted:', reason);
      },
    });
  };

  const consumeStream = async (signal: AbortSignal, limit: number) => {
    try {
      const reader = await getReader(signal);
      await reader?.pipeTo(appendToPosts(limit), { signal });
    } catch (error) {
      if (error instanceof Error && !error.message.includes('abort')) {
        console.error('Error consuming stream:', error);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    consumeStream(abortControllerRef.current.signal, 10).finally(() => setLoading(false));

    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          console.log('Anchor is intersecting, loading more posts...');
          setLoading(true);
          abortControllerRef.current = new AbortController();
          consumeStream(abortControllerRef.current.signal, 10).finally(() => setLoading(false));
        }
      },
      { threshold: 0.1 },
    );
    observerRef.current = observer;

    const target = document.getElementById('scroll-anchor');
    if (target) observer.observe(target);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loading]);

  return (
    <Box flex={4}>
      {posts.map((post, index) => (
        <Post key={index} {...post} />
      ))}
      {loading && <PostSkeleton />}
      <div id="scroll-anchor" style={{ height: '1px' }} />
    </Box>
  );
};
