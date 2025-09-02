"use client"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, Lock, Shield, Sparkles, Wallet, Zap, Globe, BarChart3, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/website/hero-section"
import { FeatureGrid } from "@/components/website/feature-grid"
import { PricingSection } from "@/components/website/pricing-section"
import { FaqAccordion } from "@/components/website/faq-accordion"
import { Footer } from "@/components/website/footer"
import { AnimatedChainLink } from "@/components/website/animated-chain-link"
import { GlassmorphicCard } from "@/components/website/glassmorphic-card"
import { DashboardPreview } from "@/components/website/dashboard-preview"
import { Web3Stats } from "@/components/website/web3-stats"
import { Navbar } from "@/components/website/Navbar"

export default function LandingPage() {

  const dashboardRef = useRef<HTMLDivElement>(null)
  const [glowPos, setGlowPos] = useState<{ x: number; y: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mouse move handler for glow (entire page)
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (window.innerWidth < 768) return
      setGlowPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/90 relative overflow-x-clip">
      {/* Intense, always-on glow following cursor (client only) */}
      {mounted && (
        <div
          className="pointer-events-none fixed z-0 transition-all duration-500"
          style={{
            width: 800,
            height: 500,
            left: glowPos ? `${glowPos.x - 400}px` : '50%',
            top: glowPos ? `${glowPos.y - 250}px` : '50%',
            transform: glowPos ? 'none' : 'translate(-50%, -50%)',
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(186,85,255,0.19) 0%, rgba(124,58,237,0.14) 60%, rgba(59,130,246,0.11) 100%)",
            filter: "blur(130px)",
            opacity: 1,
            transition: 'opacity 0.5s, left 0.3s, top 0.3s',
            pointerEvents: 'none',
          }}
        />
      )}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-[0.02] dark:opacity-[0.03]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-3/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      <Navbar />

      <main id="main-content">
        <HeroSection />

        <section className="py-8 border-y border-border/40 bg-muted/30 backdrop-blur-sm">
          <div className="container max-w-7xl">
            <Web3Stats />
          </div>
        </section>

        <section id="features" aria-labelledby="features-heading" className="py-24 scroll-mt-24">
          <div className="container max-w-7xl">
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400"
                >
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  <span>Next-Gen Features</span>
                </Badge>
              </div>
              <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold tracking-tight">Bank Sync + AI Insights</h2>
              <p className="text-muted-foreground max-w-[600px]">
                Connect securely with Powens, categorize transactions, track goals, and optimize spending with data‑driven insights.
              </p>
            </div>

            <FeatureGrid />
          </div>
        </section>

        <section
          id="dashboard"
          aria-labelledby="dashboard-heading"
          className="py-24 bg-muted/30 border-y border-border/40 relative overflow-hidden scroll-mt-24"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[url('/images/circuit-pattern.svg')] bg-repeat opacity-[0.03] dark:opacity-[0.05]"></div>
          </div>

          <div className="container max-w-7xl" ref={dashboardRef}>
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400"
                >
                  <BarChart3 className="mr-1 h-3.5 w-3.5" />
                  <span>Intuitive Interface</span>
                </Badge>
              </div>
              <h2 id="dashboard-heading" className="text-3xl sm:text-4xl font-bold tracking-tight">Powerful Dashboard Experience</h2>
              <p className="text-muted-foreground max-w-[600px]">
                Monitor your finances with precision through our high‑performance, responsive dashboard designed for your everyday money.
              </p>
            </div>

            <DashboardPreview />
          </div>
        </section>

        <section className="py-24">
          <div className="container max-w-7xl">
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400"
                >
                  <Wallet className="mr-1 h-3.5 w-3.5" />
                  <span>Seamless Integration</span>
                </Badge>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Manage Your Money in One Place</h2>
              <p className="text-muted-foreground max-w-[600px]">
                Unicent gives you a unified view of your finances—bank balances, transactions, and goals—all in one simple, secure place.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GlassmorphicCard
                icon={<Shield className="h-5 w-5 text-blue-500" />}
                title="Secure Bank Sync (Powens)"
                description="Connect your bank accounts securely and keep balances and transactions in sync."
                gradient="from-blue-500/20 to-indigo-500/20"
              />
              <GlassmorphicCard
                icon={<Target className="h-5 w-5 text-purple-500" />}
                title="Smart Savings Goals"
                description="Set goals with monthly allocations and track progress toward your targets."
                gradient="from-purple-500/20 to-pink-500/20"
                featured
              />
              <GlassmorphicCard
                icon={<BarChart3 className="h-5 w-5 text-emerald-500" />}
                title="Spending Optimization"
                description="Get data-driven recommendations by category to reduce spending and boost savings."
                gradient="from-emerald-500/20 to-teal-500/20"
              />
            </div>
          </div>
        </section>

        {/* Animated Chain Section */}
        <section className="py-16 bg-muted/30 border-y border-border/40 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[url('/images/blockchain-pattern.svg')] bg-repeat opacity-[0.03] dark:opacity-[0.05]"></div>
          </div>

          <div className="container max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 max-w-md">
                <h3 className="text-2xl font-bold mb-4">Security & Privacy by Design</h3>
                <p className="text-muted-foreground mb-6">
                  Bank‑grade encryption, read‑only bank sync via Powens, GDPR controls, and optional 2FA keep your data safe and in your control.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="border-border/60">Read‑only bank connections</Badge>
                  <Badge variant="outline" className="border-border/60">GDPR & data deletion</Badge>
                  <Badge variant="outline" className="border-border/60">Encryption in transit & at rest</Badge>
                </div>
                <Button asChild className="group relative overflow-hidden" aria-label="Explore features">
                  <Link href="#features">
                    <span className="relative z-10 flex items-center">
                      Explore Features
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                </Button>
              </div>

              <div className="flex-1 flex justify-center">
                <AnimatedChainLink />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" aria-labelledby="pricing-heading" className="py-24 scroll-mt-24">
          <div className="container max-w-7xl">
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                >
                  <Zap className="mr-1 h-3.5 w-3.5" />
                  <span>Flexible Plans</span>
                </Badge>
              </div>
              <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-bold tracking-tight">Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-[600px]">
                Choose the plan that fits your needs with no hidden fees or long-term commitments.
              </p>
            </div>

            <PricingSection />
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" aria-labelledby="faq-heading" className="py-24 bg-muted/30 border-y border-border/40 scroll-mt-24">
          <div className="container max-w-7xl">
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                >
                  <Globe className="mr-1 h-3.5 w-3.5" />
                  <span>Support</span>
                </Badge>
              </div>
              <h2 id="faq-heading" className="text-3xl sm:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-[600px]">
                Find answers to common questions about Unicent and our services.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <FaqAccordion />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5 dark:from-background dark:to-primary/10"></div>
            <div className="absolute inset-0 bg-[url('/images/cta-pattern.svg')] bg-repeat opacity-[0.02] dark:opacity-[0.04]"></div>
          </div>

          <div className="container max-w-7xl">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm p-8 md:p-12">
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Financial Future?</h3>
                  <p className="text-muted-foreground max-w-2xl">
                    Join thousands who manage money smarter with Unicent’s AI‑powered platform. Get started free—upgrade anytime.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="group relative overflow-hidden" aria-label="Get started for free">
                    <Link href="/auth/register">
                      <span className="relative z-10">Get Started Free</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="group" aria-label="View pricing plans">
                    <Link href="#pricing">
                      <Lock className="mr-2 h-4 w-4 transition-all group-hover:text-blue-500" />
                      <span>View Pricing</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
