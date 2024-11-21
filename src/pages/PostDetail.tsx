import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useComments } from '@/hooks/useComments';
import AddModal from '@/components/AddModal';

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);

    const { currentPostComments, isLoading, addComment } = useComments(id);


    useEffect(() => {
        const fetchPostAndComments = async () => {
            const postResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
            setPost(postResponse.data);
        };
        fetchPostAndComments();
    }, [id]);

    if (!post) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="mb-8">{post.body}</p>
            <div className='w-full flex items-center justify-between'>
                <h2 className="text-2xl font-bold">Comments</h2>
                <AddModal title='Add Comment' description='Add a new comment by filling out the form below.' onAdd={addComment} />
            </div>
            {isLoading ? "Loading..." : <ul className="space-y-4 mt-4">
                {currentPostComments.map((comment) => (
                    <li key={comment.id} className="bg-muted p-4 rounded-lg">
                        <h3 className="font-semibold">{comment.name}</h3>
                        <p>{comment.body}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{comment.email}</p>
                    </li>
                ))}
            </ul>}

        </div>
    );
};

export default PostDetail;