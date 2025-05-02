"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { syncBankData } from "@/services/actions/fetch-bank-data";
import { toast } from "sonner";

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

                if (result.stats) {
                    const message = result.stats.newTransactions > 0
                        ? `Synced ${result.stats.newTransactions} new transactions across ${result.stats.accountsUpdated} accounts.`
                        : "Your accounts are up to date. No new transactions found.";

                    toast("Sync Completed!", { description: message, })
                } else {
                    toast("Sync Completed", { description: "Your accounts have been synchronized." });
                }
            } else {
                setStatus("error");
                console.error("Sync failed:", result.error);
                toast("Sync Failed", {
                    description: result.error || "An error occurred while syncing"
                });
            }
        } catch (error) {
            console.error("Sync error:", error);
            setStatus("error");
            toast("Sync Failed", { description: error instanceof Error ? error.message : "An error occurred" });
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