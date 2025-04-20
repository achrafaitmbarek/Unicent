"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { syncBankData } from "@/services/actions/fetch-bank-data";

export function SyncButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSync = async () => {
        setIsLoading(true);
        setStatus("idle");

        try {
            const result = await syncBankData();

            if (result.success) {
                setStatus("success");

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setStatus("error");
                console.error("Sync failed:", result.error);
            }
        } catch (error) {
            console.error("Sync error:", error);
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleSync}
            variant={status === "error" ? "destructive" : "outline"}
            size="sm"
            disabled={isLoading}
            className="flex items-center gap-2"
        >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Syncing..." :
                status === "success" ? "Synced!" :
                    status === "error" ? "Failed" : "Sync"}
        </Button>
    );
}