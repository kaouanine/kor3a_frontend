import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/contexts/GroupContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export default function GroupsPage() {
    const { user } = useAuth();
    const { myGroups, fetchMyGroups, loading } = useGroups();
    const router = useRouter();

    useEffect(() => {
        fetchMyGroups();
    }, []);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold">My Groups</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/groups/create"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Create Group
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : myGroups.length === 0 ? (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                No groups yet
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Create your first group to get started
                            </p>
                            <Link
                                href="/groups/create"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
                            >
                                Create Group
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                                    onClick={() => router.push(`/groups/${group.id}`)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {group.name}
                                        </h3>
                                        {group.is_admin && (
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Admin
                      </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {group.description || 'No description'}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{group.member_count} members</span>
                                        <span className={group.is_private ? 'text-red-600' : 'text-green-600'}>
                      {group.is_private ? 'Private' : 'Public'}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}