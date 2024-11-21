import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star, ThumbsDown, ThumbsUp, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePostInteractions } from "@/hooks/usePostInteractions";
import { useUsers } from "@/hooks/useUsers";
import { useComments } from "@/hooks/useComments";
import { useNavigate, useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { usePosts } from "@/hooks/usePosts";
import AddModal from "@/components/AddModal";

const PostList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();


    const {
        likesCount,
        dislikesCount,
        likedPosts,
        dislikedPosts,
        favorites,
        handleLike,
        handleDislike,
        handleFavorite,
    } = usePostInteractions();

    const { posts, isLoading: isLoadingPosts, observerRef, deletePost, addPost } = usePosts();
    const { users, isLoading: isLoadingUsers } = useUsers();
    const { comments, isLoading: isLoadingComments } = useComments(id);

    const filteredPosts = posts.filter((post) => {
        const matchesSearchTerm =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.body.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUser = selectedUserId ? post.userId === selectedUserId : true;
        return matchesSearchTerm && matchesUser;
    });

    const getUserName = (userId: number) => {
        const user = users.find((user) => user.id === userId);
        return user ? user.name : "Unknown author";
    };

    const getCommentCount = (postId: number) => {
        return comments.filter((comment) => comment.postId === postId).length;
    };

    return (
        <div className="container overflow-y-auto pt-2">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Latest Posts</h2>
                <div className="flex items-center space-x-2">
                    <Select onValueChange={(value) => setSelectedUserId(Number(value))}>
                        <SelectTrigger>
                            <SelectValue placeholder="User" />
                        </SelectTrigger>
                        <SelectContent>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={String(user.id)}>
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <AddModal title="Add New Post" description="Create a new post by filling out the form below." onAdd={addPost} />

                </div>
            </div>

            {
                isLoadingUsers || isLoadingComments ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid gap-6">
                        {filteredPosts.map((post) => (
                            <Card key={`${post.id}-${nanoid()}`}>
                                <CardHeader>
                                    <CardTitle
                                        className="cursor-pointer hover:underline"
                                        onClick={() => navigate(`/posts/${post.id}`)}
                                    >
                                        {post.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{post.body.substring(0, 100)}...</p>
                                    <div className="flex items-center mt-4">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage
                                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${getUserName(post.userId)}`}
                                                alt="Avatar image"
                                            />
                                            <AvatarFallback>{getUserName(post.userId)[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>{getUserName(post.userId)}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div className="flex space-x-2">
                                        <Button
                                            variant={likedPosts[post.id] ? "secondary" : "outline"}
                                            size="sm"
                                            onClick={() => handleLike(post.id)}
                                        >
                                            <ThumbsUp className="mr-2 h-4 w-4" />
                                            {likesCount[post.id] || 0}
                                        </Button>
                                        <Button
                                            variant={dislikedPosts[post.id] ? "secondary" : "outline"}
                                            size="sm"
                                            onClick={() => handleDislike(post.id)}
                                        >
                                            <ThumbsDown className="mr-2 h-4 w-4" />
                                            {dislikesCount[post.id] || 0}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => navigate(`/posts/${post.id}`)}>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            {getCommentCount(post.id)}
                                        </Button>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant={favorites.includes(post.id) ? "secondary" : "outline"}
                                            size="sm"
                                            onClick={() => handleFavorite(post.id)}
                                        >
                                            <Star className="mr-2 h-4 w-4" />
                                            {favorites.includes(post.id) ? "In favorites" : "Add to favorites"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => deletePost(post.id)}
                                        >
                                            <Trash className=" h-4 w-4" />
                                        </Button></div>

                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )
            }

            {isLoadingPosts && <p>Loading...</p>}
            <div ref={observerRef} className="h-10"></div>
        </div >
    );
};

export default PostList;
