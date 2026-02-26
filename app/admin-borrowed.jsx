import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAllBorrowedBooks } from '../src/database/db';

export default function AdminBorrowedScreen() {
    const [borrowed, setBorrowed] = useState([]);
    const router = useRouter();

    useFocusEffect(useCallback(() => {
        setBorrowed(getAllBorrowedBooks());
    }, []));

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.bookIconContainer}>
                <Ionicons name="book" size={24} color="#f59e0b" />
            </View>
            <View style={styles.info}>
                <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>

                <View style={styles.detailRow}>
                    <Ionicons name="person-circle-outline" size={16} color="#94a3b8" />
                    <Text style={styles.borrower}>{item.username}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#94a3b8" />
                    <Text style={styles.date}>
                        {new Date(item.borrow_date).toLocaleDateString('th-TH', {
                            year: 'numeric', month: 'short', day: 'numeric',
                        })}
                    </Text>
                </View>
            </View>
            <View style={styles.badge}>
                <Ionicons name="time" size={12} color="#f59e0b" />
                <Text style={styles.badgeText}> ถูกยืม</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color="#f8fafc" />
                        <Text style={styles.back}>กลับ</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>หนังสือที่ถูกยืม</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.count}>{borrowed.length}</Text>
                    </View>
                </View>

                <FlatList
                    data={borrowed}
                    keyExtractor={(item) => String(item.transaction_id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="checkmark-done-circle-outline" size={64} color="#10b981" />
                            <Text style={styles.emptyTitle}>เยี่ยมมาก!</Text>
                            <Text style={styles.empty}>ไม่มีหนังสือถูกยืมค้างในระบบ</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0f172a' },
    container: { flex: 1, backgroundColor: '#0f172a' },
    header: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    backBtn: { flexDirection: 'row', alignItems: 'center' },
    back: { color: '#94a3b8', fontSize: 16, fontWeight: '600' },
    headerTitle: { color: '#f8fafc', fontSize: 18, fontWeight: 'bold' },
    countBadge: {
        backgroundColor: '#f59e0b',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 40,
        alignItems: 'center',
    },
    count: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
    listContainer: { padding: 16 },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#334155',
    },
    bookIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#fef3c7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    info: { flex: 1 },
    bookTitle: { fontSize: 16, fontWeight: '700', color: '#f8fafc', marginBottom: 8 },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    borrower: { fontSize: 13, color: '#e2e8f0', marginLeft: 6, fontWeight: '500' },
    date: { fontSize: 12, color: '#94a3b8', marginLeft: 6 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef3c7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20
    },
    badgeText: { fontSize: 12, fontWeight: '700', color: '#d97706' },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc', marginTop: 16, marginBottom: 8 },
    empty: { color: '#64748b', fontSize: 16 },
});
