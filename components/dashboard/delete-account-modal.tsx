"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export function DeleteAccountModal() {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");

    return (
        <>
            <div className="mt-10 flex justify-end">
                <Button variant="destructive" className="gap-2" onClick={() => setDeleteOpen(true)}>
                    <Trash2 className="h-4 w-4" /> Delete Account
                </Button>
            </div>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600"><Trash2 className="h-5 w-5" /> Delete your account?</DialogTitle>
                        <DialogDescription>
                            This action <span className="font-bold text-red-600">cannot be undone</span>.<br />
                            All your data, reports, and connections will be <span className="font-bold">permanently deleted</span>.<br />
                            To confirm, type <span className="font-mono font-bold">delete</span> below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <Input
                            autoFocus
                            placeholder="Type delete to confirm"
                            value={deleteInput}
                            onChange={e => setDeleteInput(e.target.value)}
                            className="border-red-300 focus:border-red-500"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" disabled={deleteInput !== "delete"} onClick={() => setDeleteOpen(false)}>
                            Delete Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
