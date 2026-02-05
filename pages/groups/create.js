import { useState } from 'react';
import { useRouter } from 'next/router';
import { useGroups } from '@/contexts/GroupContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export default function CreateGroupPage() {
    const router = useRouter();
    const { createGroup } = useGroups();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_private: false,
        max_members: 100,
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const result = await createGroup(formData);
            router.push(`/groups/${result.group.id}`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: error.response?.data?.message || 'An error occurred' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white shadow-md rounded-lg p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Group</h2>
                            <p className="text-gray-600 mt-2">
                                Start your own group and invite members
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                                    {errors.general}
                                </div>
                            )}

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Group Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="max_members" className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum Members
                                </label>
                                <input
                                    type="number"
                                    name="max_members"
                                    id="max_members"
                                    min="2"
                                    max="1000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.max_members}
                                    onChange={handleChange}
                                />
                                {errors.max_members && (
                                    <p className="mt-1 text-sm text-red-600">{errors.max_members[0]}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_private"
                                    id="is_private"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={formData.is_private}
                                    onChange={handleChange}
                                />
                                <label htmlFor="is_private" className="ml-2 block text-sm text-gray-900">
                                    Make this group private
                                </label>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Group'}
                                </button>
                                <Link
                                    href="/groups"
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium text-center"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}