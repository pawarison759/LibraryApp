import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { initDB } from '../src/database/db';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    useEffect(() => {
        initDB();
    }, []);

    return (
        <AuthProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
    );
}
