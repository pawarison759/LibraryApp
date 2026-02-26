import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, SafeAreaView, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAllBooks } from '../src/database/db';
import { useAuth } from '../src/context/AuthContext';

export default function BooksScreen() {
    const [books, setBooks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuth();

    const loadBooks = () => {
        setBooks(getAllBooks());
    };

    useFocusEffect(useCallback(() => { loadBooks(); }, []));

    const onRefresh = () => {
        setRefreshing(true);
        loadBooks();
        setRefreshing(false);
    };

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    const renderBook = ({ item }) => (
        <View style={styles.bookCard}>
            <View style={styles.bookIconContainer}>
                <Ionicons name="book" size={28} color="#3b82f6" />
            </View>
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.bookId}>รหัสหนังสือ #{item.book_id}</Text>
            </View>
            <View style={[styles.badge, item.status === 'available' ? styles.available : styles.borrowed]}>
                <Ionicons
                    name={item.status === 'available' ? 'checkmark-circle' : 'close-circle'}
                    size={14}
                    color={item.status === 'available' ? '#059669' : '#dc2626'}
                />
                <Text style={[styles.badgeText, item.status === 'available' ? styles.availableText : styles.borrowedText]}>
                    {item.status === 'available' ? ' ว่าง' : ' ถูกยืม'}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                        <Ionicons name="log-out-outline" size={20} color="#94a3b8" />
                        <Text style={styles.logoutText}>ออกจากระบบ</Text>
                    </TouchableOpacity>

                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.greeting}>สวัสดี, {user?.username} 👋</Text>
                            <Text style={styles.headerTitle}>รายการหนังสือทั้งหมด</Text>
                        </View>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={24} color="#3b82f6" />
                        </View>
                    </View>
                </View>

                {/* Content */}
                <FlatList
                    data={books}
                    keyExtractor={(item) => String(item.book_id)}
                    renderItem={renderBook}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="library-outline" size={64} color="#cbd5e1" />
                            <Text style={styles.empty}>ยังไม่มีหนังสือในระบบ</Text>
                        </View>
                    }
                />

                {/* Bottom Navigation */}
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuBtn} onPress={() => router.replace('/books')}>
                        <Ionicons name="library" size={24} color="#3b82f6" />
                        <Text style={[styles.menuText, styles.menuTextActive]}>หน้าแรก</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/borrow')}>
                        <Ionicons name="book-outline" size={24} color="#64748b" />
                        <Text style={styles.menuText}>ยืมหนังสือ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/return')}>
                        <Ionicons name="return-down-back" size={24} color="#64748b" />
                        <Text style={styles.menuText}>คืนหนังสือ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/history')}>
                        <Ionicons name="time-outline" size={24} color="#64748b" />
                        <Text style={styles.menuText}>ประวัติ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    logoutText: { color: '#64748b', fontSize: 14, fontWeight: '600', marginLeft: 6 },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    greeting: { color: '#64748b', fontSize: 16, marginBottom: 4 },
    headerTitle: { color: '#0f172a', fontSize: 24, fontWeight: 'bold' },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#bfdbfe',
    },
    listContainer: { padding: 16 },
    bookCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#475569',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    bookIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    bookInfo: { flex: 1, marginRight: 8 },
    bookTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
    bookId: { fontSize: 13, color: '#64748b' },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20
    },
    available: { backgroundColor: '#d1fae5' },
    borrowed: { backgroundColor: '#fee2e2' },
    badgeText: { fontSize: 12, fontWeight: '700' },
    availableText: { color: '#059669' },
    borrowedText: { color: '#dc2626' },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    empty: { textAlign: 'center', color: '#94a3b8', marginTop: 16, fontSize: 16, fontWeight: '500' },
    menu: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingVertical: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    },
    menuBtn: { flex: 1, alignItems: 'center' },
    menuText: { fontSize: 12, color: '#64748b', fontWeight: '600', marginTop: 4 },
    menuTextActive: { color: '#3b82f6' },
});
