"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AuthConsentModal({ open, onAccept }: { open: boolean; onAccept: () => void }) {
    return (
        <Dialog open={open}>
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-blue-700">Conditions d'utilisation & RGPD / DSP2</DialogTitle>
                    <DialogDescription>
                        Pour continuer, vous devez accepter nos <a href="/terms-of-service" className="underline text-blue-700">Conditions d'utilisation</a> et notre <a href="/privacy-policy" className="underline text-blue-700">Politique de confidentialité</a>.<br />
                        Unicent respecte le RGPD (droit à l'oubli, portabilité, etc.) et la directive DSP2 pour la sécurité des données bancaires.<br />
                        <span className="font-semibold text-sm text-gray-600">En cliquant sur "Accepter et continuer", vous reconnaissez et acceptez ces conditions.</span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onAccept} className="w-full">Accepter et continuer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
