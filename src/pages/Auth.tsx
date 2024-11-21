import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useUsers } from '@/hooks/useUsers'


export default function AuthPage() {
    const [selectedUser, setSelectedUser] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const { users, isLoading: isLoadingUsers } = useUsers();


    const handleLogin = () => {
        if (selectedUser) {
            const user = users.find(user => user.name === selectedUser);
            const userId = user?.id;
            const email = user?.email;
            if (userId) {
                localStorage.setItem('userId', String(userId));
                localStorage.setItem('email', email || '');
            }
            navigate('/posts');
        } else {
            setError('Please select a user');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Authorization</CardTitle>
                    <CardDescription>Select a user to log in</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={setSelectedUser} value={selectedUser}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={isLoadingUsers ? "Loading..." : "Select a user"} />
                        </SelectTrigger>
                        <SelectContent>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={user.name}>
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button className="w-full" onClick={handleLogin}>Log In</Button>
                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}