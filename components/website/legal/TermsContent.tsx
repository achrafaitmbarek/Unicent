"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function TermsContent() {
    const [langFr, setLangFr] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    {langFr ? "Conditions d'utilisation" : "Terms of Service"}
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
                    <h2>1. Objet</h2>
                    <p>Ces Conditions régissent votre accès et votre utilisation des services Unicent.</p>

                    <h2>2. Définitions</h2>
                    <ul>
                        <li>« Service »: l’application, le site et les API d’Unicent.</li>
                        <li>« Compte »: l’espace utilisateur permettant d’accéder au Service.</li>
                        <li>« Contenu »: informations fournies par vous ou générées via le Service.</li>
                    </ul>

                    <h2>3. Éligibilité</h2>
                    <p>Vous devez avoir l’âge légal et la capacité juridique requise pour utiliser le Service.</p>

                    <h2>4. Comptes & sécurité</h2>
                    <ul>
                        <li>Tenez vos identifiants confidentiels et signalez tout accès non autorisé.</li>
                        <li>Nous pouvons suspendre un compte en cas d’abus ou de risque de sécurité.</li>
                    </ul>

                    <h2>5. Abonnements & facturation</h2>
                    <ul>
                        <li>Modèle freemium; Premium: 3,33 € / mois ou 36 € / an (prix indicatifs, taxes éventuelles).</li>
                        <li>Renouvellement automatique jusqu’à résiliation; vous pouvez annuler à tout moment.</li>
                        <li>Essais gratuits et remboursements: soumis aux conditions affichées au moment de l’achat.</li>
                    </ul>

                    <h2>6. Utilisation acceptable</h2>
                    <ul>
                        <li>Interdiction de fraude, de rétro‑ingénierie ou d’atteinte à la sécurité.</li>
                        <li>Respect de la loi et des droits des tiers; pas d’utilisation illégale ou abusive.</li>
                    </ul>

                    <h2>7. Intégrations bancaires</h2>
                    <ul>
                        <li>Connexions via Powens en lecture seule; Unicent ne peut pas initier de paiements.</li>
                        <li>Vous autorisez la synchronisation de données nécessaires au fonctionnement du Service.</li>
                    </ul>

                    <h2>8. Propriété intellectuelle</h2>
                    <ul>
                        <li>Vous conservez vos contenus; vous nous accordez une licence pour les exploiter afin de fournir le Service.</li>
                        <li>Unicent et ses fournisseurs conservent leurs droits sur le logiciel, les marques et modèles.</li>
                    </ul>

                    <h2>9. Commentaires & suggestions</h2>
                    <p>Vous nous accordez une licence non exclusive pour utiliser vos retours afin d’améliorer le Service.</p>

                    <h2>10. Absence de conseil financier</h2>
                    <p>Les informations fournies sont à visée éducative. Elles ne constituent pas un conseil financier.</p>

                    <h2>11. Garanties & exclusions</h2>
                    <p>Le Service est fourni « tel quel ». Nous excluons les garanties dans la mesure permise par la loi.</p>

                    <h2>12. Limitation de responsabilité</h2>
                    <p>
                        Dans la limite autorisée, notre responsabilité globale est limitée aux montants que vous avez payés
                        au cours des 12 derniers mois pour le Service concerné.
                    </p>

                    <h2>13. Indemnisation</h2>
                    <p>Vous acceptez d’indemniser Unicent contre les réclamations liées à votre utilisation illégale du Service.</p>

                    <h2>14. Résiliation</h2>
                    <ul>
                        <li>Vous pouvez résilier à tout moment; la résiliation peut entraîner la suppression des données.</li>
                        <li>Nous pouvons résilier en cas de violation substantielle des présentes Conditions.</li>
                    </ul>

                    <h2>15. Droit applicable & juridiction</h2>
                    <p>La loi applicable et la juridiction compétente seront indiquées selon votre pays de résidence.</p>

                    <h2>16. Modifications</h2>
                    <p>Nous pouvons mettre à jour ces Conditions. La version à jour sera publiée avec la date d’effet.</p>

                    <h2>17. Contact</h2>
                    <p>Questions: <a href="mailto:legal@unicent.app">legal@unicent.app</a>.</p>
                </div>
            ) : (
                <div className="prose prose-gray dark:prose-invert">
                    <h2>1. Purpose</h2>
                    <p>These Terms govern your access to and use of Unicent’s services.</p>

                    <h2>2. Definitions</h2>
                    <ul>
                        <li>“Service”: Unicent’s app, website, and APIs.</li>
                        <li>“Account”: your user area to access the Service.</li>
                        <li>“Content”: information you provide or generated via the Service.</li>
                    </ul>

                    <h2>3. Eligibility</h2>
                    <p>You must be of legal age and have capacity to use the Service.</p>

                    <h2>4. Accounts & security</h2>
                    <ul>
                        <li>Keep credentials confidential and report unauthorized access.</li>
                        <li>We may suspend accounts in case of abuse or security risk.</li>
                    </ul>

                    <h2>5. Subscriptions & billing</h2>
                    <ul>
                        <li>Freemium; Premium: €3.33 / month or €36 / year (indicative, taxes may apply).</li>
                        <li>Auto‑renew until cancelled; you can cancel anytime.</li>
                        <li>Trials and refunds: subject to the terms shown at purchase.</li>
                    </ul>

                    <h2>6. Acceptable use</h2>
                    <ul>
                        <li>No fraud, reverse engineering, or security violations.</li>
                        <li>Comply with the law and third‑party rights; no unlawful or abusive use.</li>
                    </ul>

                    <h2>7. Banking integrations</h2>
                    <ul>
                        <li>Connections via Powens are read‑only; Unicent cannot initiate payments.</li>
                        <li>You authorize syncing of data necessary to operate the Service.</li>
                    </ul>

                    <h2>8. Intellectual property</h2>
                    <ul>
                        <li>You retain your content; you grant us a license to operate the Service.</li>
                        <li>Unicent and suppliers retain rights in software, trademarks, and designs.</li>
                    </ul>

                    <h2>9. Feedback</h2>
                    <p>You grant a non‑exclusive license to use your feedback to improve the Service.</p>

                    <h2>10. No financial advice</h2>
                    <p>Information is educational only and does not constitute financial advice.</p>

                    <h2>11. Warranties & disclaimers</h2>
                    <p>The Service is provided “as is”. We disclaim warranties to the extent permitted by law.</p>

                    <h2>12. Limitation of liability</h2>
                    <p>
                        To the extent allowed, our aggregate liability is limited to amounts you paid in the last 12
                        months for the relevant Service.
                    </p>

                    <h2>13. Indemnity</h2>
                    <p>You agree to indemnify Unicent for claims tied to your unlawful use of the Service.</p>

                    <h2>14. Termination</h2>
                    <ul>
                        <li>You may terminate anytime; termination may result in data deletion.</li>
                        <li>We may terminate for material breach of these Terms.</li>
                    </ul>

                    <h2>15. Governing law & venue</h2>
                    <p>Applicable law and venue depend on your country of residence.</p>

                    <h2>16. Changes</h2>
                    <p>We may update these Terms. The updated version will state its effective date.</p>

                    <h2>17. Contact</h2>
                    <p>Questions: <a href="mailto:legal@unicent.app">legal@unicent.app</a>.</p>
                </div>
            )}
        </>
    )
}
