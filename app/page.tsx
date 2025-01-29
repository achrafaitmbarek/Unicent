import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Logo from '@/assets/TypoLogoForground.png';
import launchIcon from "@/assets/launch-icon.png";

export const metadata: Metadata = {
  title: 'Unicent - Elevate Your Future',
  description: "Experience the future of financial management with Unicent's AI-powered platform.",
};

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-950 to-[#061237] flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent" />

      <div className="relative w-full max-w-4xl px-4">
        <div className="mb-16 text-center">
          <Image
            src={Logo}
            alt="Unicent Logo"
            className="h-20 w-auto mx-auto transition-all duration-700 filter brightness-150"
            priority
          />
        </div>

        <div className="w-full backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-12 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent blur-2xl" />

            <div className="mb-12 flex justify-center">
              <div className="relative transform transition-all duration-1000 hover:scale-110">
                <Image
                  src={launchIcon}
                  alt="Launch Icon"
                  className="h-40 w-auto relative animate-float filter brightness-125"
                  priority
                />
              </div>
            </div>

            <h1 className="text-5xl font-bold text-white mb-2">
              Financial Dashboard
            </h1>
            <p className="text-2xl text-blue-400 mb-8">
              Coming Soon
            </p>

            <p className="text-xl text-gray-300 mb-6">
              Level Up Your Finances with AI Superpowers
            </p>

            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-gray-400 leading-relaxed">
                We&apos;re crafting an extraordinary financial experience. Our AI-driven platform
                will transform how you understand, manage, and grow your wealth.
              </p>
            </div>

            <Link href="/auth/login" className="inline-block">
              <Button
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg rounded-xl flex items-center gap-2 
                transition-all duration-500 hover:translate-y-[-2px] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
              >
                Connect to Dashboard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <p className="text-gray-500 mt-12 text-sm">
              © {new Date().getFullYear()} Unicent. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

