'use client'
import Image from 'next/image'

export default function VerifyRequest() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center space-y-6">
                {/* Optional: Add your logo */}
                <div className="flex justify-center">
                    <Image
                        src="/your-logo.png"
                        alt="Logo"
                        width={80}
                        height={80}
                        className="rounded-full"
                    />
                </div>

                <h2 className="text-3xl font-bold text-white">Check your inbox</h2>

                <div className="space-y-4">
                    <p className="text-gray-300">
                        Weve sent you a magic link to your email address.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Click the link in the email to sign in to your account.
                    </p>
                </div>

                {/* Optional: Add an animation */}
                <div className="flex justify-center py-4">
                    <div className="animate-bounce bg-blue-500 p-2 w-10 h-10 ring-1 ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                    </div>
                </div>

                {/* Optional: Add a resend button */}
                <button
                    className="mt-8 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
                    onClick={() => window.location.href = '/auth/signin'}
                >
                    Back to sign in
                </button>

                {/* Optional: Add help text */}
                <p className="text-sm text-gray-400 mt-6">
                    Didnt receive the email? Check your spam folder or{' '}
                    <a href="/auth/signin" className="text-blue-400 hover:text-blue-300">
                        try another email address
                    </a>
                </p>
            </div>
        </div>
    )
}