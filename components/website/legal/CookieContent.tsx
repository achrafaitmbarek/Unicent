"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function CookieContent() {
    const [langFr, setLangFr] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    {langFr ? "Politique de Cookies" : "Cookie Policy"}
                </h1>
                <div className="flex items-center gap-2">
                    <Label htmlFor="lang-toggle" className="text-sm text-muted-foreground">
                        {langFr ? "Français" : "English"}
                    </Label>
                    <Switch id="lang-toggle" checked={langFr} onCheckedChange={setLangFr} aria-label="Language" />
                </div>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
                {langFr ? "Dernière mise à jour" : "Last updated"}: 30 Aug 2025
            </p>

            <div className="mb-8 p-4 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/40">
                <strong>{langFr ? "Conformité RGPD & DSP2" : "GDPR & PSD2 Compliance"}</strong><br />
                {langFr
                    ? "Unicent respecte le RGPD (droit d'accès, de rectification, d'effacement, portabilité, opposition, limitation, droit à l'oubli) et la directive DSP2 pour la sécurité et la confidentialité des données bancaires."
                    : "Unicent complies with GDPR (right of access, rectification, erasure, portability, objection, restriction, right to be forgotten) and PSD2 for secure and confidential banking data handling."}
            </div>

            {langFr ? (
                <div className="prose prose-gray dark:prose-invert space-y-6">
                    <h2>Suppression automatique & inactivité</h2>
                    <ul>
                        <li>Votre compte peut être supprimé automatiquement après 90 jours d&apos;inactivité (aucune connexion ou action).</li>
                        <li>Un email d’avertissement sera envoyé avant toute suppression définitive.</li>
                        <li>Vous pouvez à tout moment demander la suppression immédiate de votre compte et de toutes vos données (“droit à l’oubli”).</li>
                    </ul>
                    <p>
                        Cette politique explique comment Unicent utilise des cookies et des technologies similaires sur
                        nos sites et applications. Pour des informations générales sur notre traitement des données,
                        consultez notre Politique de Confidentialité.
                    </p>

                    <h2>Qu’est‑ce qu’un cookie ?</h2>
                    <p>
                        Un cookie est un petit fichier stocké sur votre appareil lorsque vous visitez un site. Des
                        technologies similaires (balises web, stockage local, SDK) peuvent également être utilisées.
                    </p>

                    <h2>Catégories de cookies que nous utilisons</h2>
                    <ul>
                        <li><strong>Essentiels</strong>: nécessaires au fonctionnement (authentification, session, sécurité).</li>
                        <li><strong>Préférences</strong>: langue, thème, mises en page, paramètres de notifications.</li>
                        <li><strong>Mesure d’audience</strong>: analyse d’usage, performance, tests A/B.</li>
                        <li><strong>Fonctionnels/tiers</strong>: intégrations (p. ex., Powens pour l’agrégation bancaire), paiements, emails.</li>
                    </ul>

                    <h2>Fondement légal & consentement</h2>
                    <p>
                        Nous nous appuyons sur l’intérêt légitime pour les cookies essentiels. Les autres catégories
                        (préférences, mesure, fonctionnels) sont utilisées sur la base de votre consentement lorsque la
                        loi l’exige. Vous pouvez retirer votre consentement à tout moment.
                    </p>

                    <h2>Gestion des cookies</h2>
                    <ul>
                        <li>Paramètres du navigateur: blocage/suppression des cookies par site ou globalement.</li>
                        <li>Réglages dans l’application Unicent lorsque disponibles.</li>
                        <li>Contrôles spécifiques des tiers (p. ex., options de désinscription d’analytique).</li>
                    </ul>

                    <h2>Durée de vie & conservation</h2>
                    <p>
                        Certains cookies sont de session (supprimés à la fermeture du navigateur), d’autres persistants
                        (expirent après une durée définie). Les durées varient selon la finalité.
                    </p>

                    <h2>Ne pas me pister (DNT) & Global Privacy Control (GPC)</h2>
                    <p>
                        Nous honorons, lorsque techniquement possible, des signaux comme GPC pour limiter certains
                        traitements non essentiels. Les cookies strictement nécessaires ne peuvent pas être désactivés
                        car ils sont indispensables au service.
                    </p>

                    <h2>Cookies tiers</h2>
                    <ul>
                        <li><strong>Powens</strong> (lecture seule) pour les connexions bancaires.</li>
                        <li><strong>Stripe</strong> pour les paiements.</li>
                        <li><strong>Resend</strong> pour l’envoi d’emails transactionnels.</li>
                        <li>Fournisseurs d’infrastructure et d’analytique selon besoin.</li>
                    </ul>

                    <h2>Mises à jour de cette politique</h2>
                    <p>
                        Nous pouvons modifier cette politique pour refléter des changements techniques, légaux ou
                        opérationnels. Nous publierons la version à jour avec la date de modification.
                    </p>

                    <h2>Contact</h2>
                    <p>
                        Pour toute question: <a href="mailto:privacy@unicent.app">privacy@unicent.app</a>.
                    </p>
                </div>
            ) : (
                <div className="prose prose-gray dark:prose-invert">
                    <p>
                        This policy explains how Unicent uses cookies and similar technologies across our websites and
                        apps. For general information about our data practices, see our Privacy Policy.
                    </p>

                    <h2>What is a cookie?</h2>
                    <p>
                        A cookie is a small file stored on your device when you visit a site. Similar technologies
                        (web beacons, local storage, SDKs) may also be used.
                    </p>

                    <h2>Categories of cookies we use</h2>
                    <ul>
                        <li><strong>Essential</strong>: required for operation (authentication, session, security).</li>
                        <li><strong>Preferences</strong>: language, theme, layouts, notification settings.</li>
                        <li><strong>Analytics</strong>: usage analysis, performance, A/B testing.</li>
                        <li><strong>Functional/third‑party</strong>: integrations (e.g., Powens for bank aggregation), payments, email.</li>
                    </ul>

                    <h2>Legal basis & consent</h2>
                    <p>
                        We rely on legitimate interests for essential cookies. Other categories (preferences, analytics,
                        functional) are used based on your consent where required by law. You may withdraw consent at any
                        time.
                    </p>

                    <h2>Managing cookies</h2>
                    <ul>
                        <li>Browser settings: block/delete cookies per‑site or globally.</li>
                        <li>Controls within the Unicent app where available.</li>
                        <li>Vendor‑specific opt‑outs (e.g., analytics opt‑out tools).</li>
                    </ul>

                    <h2>Lifetime & retention</h2>
                    <p>
                        Some cookies are session‑based (deleted when you close the browser), others are persistent
                        (expire after a set duration). Durations vary by purpose.
                    </p>

                    <h2>Do Not Track (DNT) & Global Privacy Control (GPC)</h2>
                    <p>
                        Where technically feasible, we honor signals like GPC to limit certain non‑essential processing.
                        Strictly necessary cookies cannot be disabled as they are essential to the service.
                    </p>

                    <h2>Third‑party cookies</h2>
                    <ul>
                        <li><strong>Powens</strong> (read‑only) for bank connections.</li>
                        <li><strong>Stripe</strong> for payments.</li>
                        <li><strong>Resend</strong> for transactional emails.</li>
                        <li>Infrastructure and analytics providers as needed.</li>
                    </ul>

                    <h2>Changes to this policy</h2>
                    <p>
                        We may modify this policy to reflect technical, legal, or operational changes. We will post the
                        updated version with the effective date.
                    </p>

                    <h2>Contact</h2>
                    <p>
                        Questions? Contact <a href="mailto:privacy@unicent.app">privacy@unicent.app</a>.
                    </p>
                </div>
            )}
        </>
    )
}
