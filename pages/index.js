import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-8">
                    Welcome to Next.js + Laravel
                </h1>
                <p className="text-xl text-white mb-8">
                    Authentication with Sanctum
                </p>
                <div className="space-x-4">
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}