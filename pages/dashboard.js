import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/contexts/GroupContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { myGroups, fetchMyGroups } = useGroups();

    useEffect(() => {
        fetchMyGroups();
    }, []);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center space-x-8">
                                <h1 className="text-xl font-bold">Dashboard</h1>
                                <Link
                                    href="/groups"
                                    className="text-gray-700 hover:text-gray-900 font-medium"
                                >
                                    My Groups
                                </Link>
                            </div>
                            <div className="flex items-center">
                <span className="text-gray-700 mr-4">
                  Welcome, {user?.name}
                </span>
                                <button
                                    onClick={logout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* User Info Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                            <div className="space-y-2">
                                <p><strong>Name:</strong> {user?.name}</p>
                                <p><strong>Email:</strong> {user?.email}</p>
                                <p><strong>Member ID:</strong> {user?.id}</p>
                            </div>
                        </div>

                        {/* Groups Summary */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">My Groups</h2>
                                <Link
                                    href="/groups/create"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                                >
                                    Create Group
                                </Link>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">{myGroups.length}</p>
                            <p className="text-gray-600">Total groups</p>
                            <Link
                                href="/groups"
                                className="mt-4 inline-block text-blue-600 hover:text-blue-700"
                            >
                                View all groups →
                            </Link>
                        </div>
                    </div>

                    {/* Recent Groups */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Recent Groups</h2>
                        {myGroups.length === 0 ? (
                            <p className="text-gray-600">You haven't joined any groups yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {myGroups.slice(0, 5).map((group) => (
                                    <Link
                                        key={group.id}
                                        href={`/groups/${group.id}`}
                                        className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{group.name}</h3>
                                                <p className="text-sm text-gray-600">{group.member_count} members</p>
                                            </div>
                                            {group.is_admin && (
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Admin
                        </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}