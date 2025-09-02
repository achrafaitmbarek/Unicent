"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PencilLine, Check, X } from "lucide-react"
import { updateUser } from "@/services/actions/user"
import { toast } from 'sonner'

interface EditableUserNameProps {
    initialName: string
}

export function EditableUserName({ initialName }: EditableUserNameProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(initialName)
    const [pendingName, setPendingName] = useState(initialName)

    const handleEdit = () => {
        setIsEditing(true)
        setPendingName(name)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setPendingName(name)
    }

    const handleSave = async () => {
        try {
            await updateUser({ name: pendingName })
            setName(pendingName)
            setIsEditing(false)
            toast.success("Your name has been updated")
        } catch (error) {
            toast.error("Failed to update your name", {
                description: error instanceof Error ? error.message : String(error)
            })
        }
    }

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <Input
                    value={pendingName}
                    onChange={(e) => setPendingName(e.target.value)}
                    className="h-9"
                />
                <Button size="icon" variant="ghost" onClick={handleSave} className="h-9 w-9">
                    <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCancel} className="h-9 w-9">
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between">
            <div className="text-base">{name || "Add your name"}</div>
            <Button variant="ghost" size="sm" className="text-[#8f939f] hover:text-[#01254b] px-4" onClick={handleEdit}>
                <PencilLine className="h-4 w-4 mr-1" />
                Edit
            </Button>
        </div>
    )
}