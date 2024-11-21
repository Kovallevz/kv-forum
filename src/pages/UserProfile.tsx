import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ROUTES } from '@/constants/routes'

interface UserData {
    id: number
    name: string
    username: string
    email: string
    address: {
        street: string
        suite: string
        city: string
        zipcode: string
        geo: {
            lat: string
            lng: string
        }
    }
    phone: string
    website: string
    company: {
        name: string
        catchPhrase: string
        bs: string
    }
}

export default function UserProfile() {
    const [userData, setUserData] = useState<UserData | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const userId = localStorage.getItem('userId')
        if (!userId) {
            navigate(ROUTES.AUTH)
            return
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
                setUserData(response.data)
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }

        fetchUserData()
    }, [navigate])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData(prevData => {
            if (!prevData) return null
            if (name.includes('.')) {
                const [parent, child] = name.split('.')
                return {
                    ...prevData,
                    [parent]: {
                        ...(prevData[parent as keyof UserData] as Record<string, unknown>),
                        [child]: value
                    }
                }
            }
            return { ...prevData, [name]: value }
        })
    }

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userData) return

        try {
            await axios.put(`https://jsonplaceholder.typicode.com/users/${userData.id}`, userData)
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating user data:', error)
        }
    }, [userData])

    const handleLogout = () => {
        localStorage.removeItem('userId')
        localStorage.removeItem('email')
        navigate(ROUTES.AUTH)
    }

    if (!userData) return <div>Loading...</div>

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">User Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center mb-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${userData.username}`}
                                alt="User avatar"
                            />
                            <AvatarFallback>{userData.name[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={userData.username}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={userData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    name="website"
                                    value={userData.website}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="company.name">Company</Label>
                                <Input
                                    id="company.name"
                                    name="company.name"
                                    value={userData.company.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address.street">Street</Label>
                                <Input
                                    id="address.street"
                                    name="address.street"
                                    value={userData.address.street}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address.suite">Suite</Label>
                                <Input
                                    id="address.suite"
                                    name="address.suite"
                                    value={userData.address.suite}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address.city">City</Label>
                                <Input
                                    id="address.city"
                                    name="address.city"
                                    value={userData.address.city}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address.zipcode">Zipcode</Label>
                                <Input
                                    id="address.zipcode"
                                    name="address.zipcode"
                                    value={userData.address.zipcode}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                            {isEditing ? (
                                <>
                                    <Button type="submit" className="mr-2">Save</Button>
                                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                </>
                            ) : (
                                <Button type="button" onClick={(e) => {
                                    e.preventDefault();
                                    setIsEditing(true)
                                }}>Edit</Button>
                            )}
                            <Button type="button" variant="outline" onClick={handleLogout} className="ml-2">Logout</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}