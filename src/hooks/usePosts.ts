import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

export const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const fetchPosts = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`
            );
            const newPosts = response.data;

            setHasMore(newPosts.length > 0);

            setPosts((prev) => [...prev, ...newPosts]);
        } catch (error) {
            console.error("Error loading posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleObserver = useCallback(
        ([entry]: IntersectionObserverEntry[]) => {
            if (entry.isIntersecting && hasMore && !isLoading) {
                setPage((prevPage) => prevPage + 1);
            }
        },
        [hasMore, isLoading]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [handleObserver]);

    useEffect(() => {
        fetchPosts(page);
    }, [page]);

    const deletePost = async (id: number) => {
        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
            setPosts((prevPosts) => prevPosts.filter(post => post.id !== id));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const addPost = async (title: string, body: string) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("userId not found in localStorage");
            return;
        }

        try {
            const response = await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
                title,
                body,
                userId: Number(userId),
            });
            setPosts((prevPosts) => [response.data, ...prevPosts]);
        } catch (error) {
            console.error("Error adding post:", error);
        }
    };

    return { posts, isLoading, observerRef, deletePost, addPost };
};
