/*
import '@/styles/globals.css';
*/
import { AuthProvider } from '@/contexts/AuthContext';
import { GroupProvider } from '@/contexts/GroupContext';

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <GroupProvider>
                <Component {...pageProps} />
            </GroupProvider>
        </AuthProvider>
    );
}