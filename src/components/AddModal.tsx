import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface AddPostModalProps {
    title: string;
    description: string;
    onAdd: (title: string, body: string) => void
}

function AddModal({ title: titleFromProps, description: descriptionFromProps, onAdd }: AddPostModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd(title, body)
        setTitle('')
        setBody('')
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">{titleFromProps}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{titleFromProps}</DialogTitle>
                    <DialogDescription>
                        {descriptionFromProps}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="body" className="text-right">
                                Body
                            </Label>
                            <Textarea
                                id="body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Post</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddModal;