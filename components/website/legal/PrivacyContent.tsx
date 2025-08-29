"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function PrivacyContent() {
    const [langFr, setLangFr] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    {langFr ? "Politique de Confidentialité" : "Privacy Policy"}
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

            {langFr ? (
                <div className="prose prose-gray dark:prose-invert">
                    <p>
                        Unicent est une plateforme de gestion financière assistée par l’IA. Cette politique décrit quelles données
                        nous collectons, dans quels buts, sur quelles bases légales, comment nous les protégeons et quels sont vos
                        droits.
                    </p>

                    <h2>Portée & Responsable du traitement</h2>
                    <p>
                        Cette politique s’applique aux services Unicent. Le responsable du traitement est Unicent (&quot;nous&quot;). Pour
                        toute question, contactez <a href="mailto:privacy@unicent.app">privacy@unicent.app</a>.
                    </p>

                    <h2>Catégories de données que nous traitons</h2>
                    <ul>
                        <li>Identité et contact: nom, email, image de profil (si fournie).</li>
                        <li>Comptes bancaires en lecture seule via Powens: soldes, identifiants techniques d’accounts.</li>
                        <li>Transactions: date, libellé, montant, catégorie, compte associé.</li>
                        <li>Préférences: objectifs d’épargne, paramètres de rapports et d’insights.</li>
                        <li>Techniques: logs, identifiants de session, appareil, langue, préférences d’interface.</li>
                        <li>Communication: emails et préférences de notification.</li>
                    </ul>

                    <h2>Finalités & bases légales</h2>
                    <ul>
                        <li>Fourniture du service (exécution du contrat): synchronisation bancaire, catégorisation, tableaux de bord.</li>
                        <li>Recommandations personnalisées (consentement): conseils, optimisations de dépenses, alertes.</li>
                        <li>Support client et sécurité (intérêt légitime): prévention de fraude, diagnostic incidents.</li>
                        <li>Communication (consentement): emails d’information et de produit.</li>
                        <li>Obligations légales: conformité PSD2 et réglementations applicables.</li>
                    </ul>

                    <h2>Conservation des données</h2>
                    <ul>
                        <li>Compte & profil: conservés tant que le compte est actif; suppression à la clôture.</li>
                        <li>Transactions: conservées pour l’analyse et les rapports; suppression sur demande ou à l’issue des délais légaux.</li>
                        <li>Journaux techniques: durée limitée pour sécurité et dépannage.</li>
                        <li>Communications: conservées conformément aux obligations légales et au support.</li>
                    </ul>

                    <h2>Mesures de sécurité</h2>
                    <ul>
                        <li>Chiffrement en transit (TLS/HTTPS) et bonnes pratiques d’architecture.</li>
                        <li>Connexions bancaires en lecture seule via Powens (nous ne pouvons pas initier de paiements).</li>
                        <li>Contrôles d’accès stricts, séparation des environnements, journalisation.</li>
                        <li>Authentification sécurisée et options d’authentification renforcée lorsque disponible.</li>
                    </ul>

                    <h2>Partage avec des tiers</h2>
                    <ul>
                        <li>Powens (conforme PSD2) pour l’agrégation bancaire en lecture seule.</li>
                        <li>Fournisseurs IA (p. ex., Anthropic/OpenAI) pour générer des recommandations.</li>
                        <li>Prestataires d’email (p. ex., Resend) pour l’envoi de notifications.</li>
                        <li>Fournisseurs d’infrastructure et d’analytique lorsque nécessaire.</li>
                        <li>Jamais de vente de vos données; partage uniquement avec base légale appropriée.</li>
                    </ul>

                    <h2>Transferts internationaux</h2>
                    <p>
                        Lorsque des données sont transférées hors de l’UE/EEE, nous appliquons des garanties appropriées (p. ex.,
                        clauses contractuelles types) afin de protéger vos informations.
                    </p>

                    <h2>Vos droits (RGPD)</h2>
                    <ul>
                        <li>Accès, rectification, effacement, limitation et portabilité.</li>
                        <li>Opposition au traitement fondé sur l’intérêt légitime.</li>
                        <li>Retrait du consentement à tout moment (sans effet rétroactif).</li>
                        <li>Plainte auprès de l’autorité de contrôle compétente.</li>
                    </ul>
                    <p>
                        Pour exercer vos droits: <a href="mailto:privacy@unicent.app">privacy@unicent.app</a>.
                    </p>

                    <h2>Mineurs</h2>
                    <p>Nos services ne visent pas les enfants. Ne créez pas de compte si vous n’avez pas l’âge légal requis.</p>

                    <h2>Décisions automatisées & profilage</h2>
                    <p>
                        Nous utilisons des modèles pour catégoriser les transactions et proposer des recommandations. Aucune décision
                        produisant des effets juridiques similaires n’est prise sans intervention humaine.
                    </p>

                    <h2>Mises à jour de cette politique</h2>
                    <p>
                        Nous pouvons mettre à jour cette politique. La version courante sera publiée ici avec la date de mise à jour.
                    </p>
                </div>
            ) : (
                <div className="prose prose-gray dark:prose-invert">
                    <p>
                        Unicent is an AI‑assisted personal finance platform. This policy explains what data we collect, for what
                        purposes, on which legal bases, how we protect it, and your rights.
                    </p>

                    <h2>Scope & Controller</h2>
                    <p>
                        This policy applies to Unicent’s services. The data controller is Unicent (&quot;we&quot;). For questions, contact
                        <a href="mailto:privacy@unicent.app"> privacy@unicent.app</a>.
                    </p>

                    <h2>Categories of data we process</h2>
                    <ul>
                        <li>Identity & contact: name, email, profile image (if provided).</li>
                        <li>Bank accounts via Powens (read‑only): balances, technical account identifiers.</li>
                        <li>Transactions: date, payee/wording, amount, category, linked account.</li>
                        <li>Preferences: savings goals, reporting and insights settings.</li>
                        <li>Technical: logs, session identifiers, device, language, UI preferences.</li>
                        <li>Communications: emails and notification preferences.</li>
                    </ul>

                    <h2>Purposes & legal bases</h2>
                    <ul>
                        <li>Service delivery (contract): bank sync, categorization, dashboards.</li>
                        <li>Personalized recommendations (consent): tips, spending optimization, alerts.</li>
                        <li>Support & security (legitimate interests): fraud prevention, incident diagnostics.</li>
                        <li>Communications (consent): product and service emails.</li>
                        <li>Legal compliance: PSD2 and other applicable regulations.</li>
                    </ul>

                    <h2>Data retention</h2>
                    <ul>
                        <li>Account & profile: retained while the account is active; deleted upon closure.</li>
                        <li>Transactions: retained for analytics and reporting; deleted upon request or after legal limits.</li>
                        <li>Technical logs: kept for a limited time for security and troubleshooting.</li>
                        <li>Communications: retained to comply with legal obligations and support.</li>
                    </ul>

                    <h2>Security measures</h2>
                    <ul>
                        <li>Encryption in transit (TLS/HTTPS) and secure architecture practices.</li>
                        <li>Read‑only bank connections via Powens (we cannot move funds).</li>
                        <li>Strict access controls, environment separation, and logging.</li>
                        <li>Secure authentication and optional stronger authentication where available.</li>
                    </ul>

                    <h2>Sharing with third parties</h2>
                    <ul>
                        <li>Powens (PSD2‑compliant) for read‑only bank aggregation.</li>
                        <li>AI providers (e.g., Anthropic/OpenAI) to generate recommendations.</li>
                        <li>Email providers (e.g., Resend) to send notifications.</li>
                        <li>Infrastructure/analytics providers where necessary.</li>
                        <li>We do not sell your data; sharing occurs only with an appropriate legal basis.</li>
                    </ul>

                    <h2>International transfers</h2>
                    <p>
                        Where data is transferred outside the EU/EEA, we apply safeguards (e.g., Standard Contractual Clauses) to
                        protect your information.
                    </p>

                    <h2>Your rights (GDPR)</h2>
                    <ul>
                        <li>Access, rectification, erasure, restriction, and portability.</li>
                        <li>Object to processing based on legitimate interests.</li>
                        <li>Withdraw consent at any time (without retroactive effect).</li>
                        <li>Lodge a complaint with a supervisory authority.</li>
                    </ul>
                    <p>
                        To exercise your rights: <a href="mailto:privacy@unicent.app">privacy@unicent.app</a>.
                    </p>

                    <h2>Children’s privacy</h2>
                    <p>Our services are not directed to children. Do not create an account if you are below the legal age.</p>

                    <h2>Automated decisions & profiling</h2>
                    <p>
                        We use models to categorize transactions and surface recommendations. No decisions producing legal or
                        similarly significant effects are made without human oversight.
                    </p>

                    <h2>Changes to this policy</h2>
                    <p>
                        We may update this policy. The current version will be posted here with an updated “Last updated” date.
                    </p>
                </div>
            )}
        </>
    )
}
