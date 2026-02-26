import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUserTransactions } from '../src/database/db';
import { useAuth } from '../src/context/AuthContext';

export default function HistoryScreen() {
    const [transactions, setTransactions] = useState([]);
    const router = useRouter();
    const { user } = useAuth();

    useFocusEffect(useCallback(() => {
        setTransactions(getUserTransactions(user.user_id));
    }, []));

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.titleContainer}>
                    <Ionicons
                        name={item.status === 'borrowing' ? 'book' : 'checkmark-done-circle'}
                        size={18}
                        color={item.status === 'borrowing' ? '#f59e0b' : '#10b981'}
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
                </View>
                <View style={[styles.badge, item.status === 'borrowing' ? styles.borrowing : styles.returned]}>
                    <Text style={[styles.badgeText, item.status === 'borrowing' ? styles.borrowingText : styles.returnedText]}>
                        {item.status === 'borrowing' ? 'กำลังยืม' : 'คืนแล้ว'}
                    </Text>
                </View>
            </View>

            <View style={styles.dateContainer}>
                <View style={styles.dateRow}>
                    <Ionicons name="arrow-up-circle-outline" size={16} color="#3b82f6" />
                    <Text style={styles.dateText}>
                        ยืม: {new Date(item.borrow_date).toLocaleDateString('th-TH', {
                            year: 'numeric', month: 'short', day: 'numeric',
                        })}
                    </Text>
                </View>
                {item.return_date && (
                    <View style={styles.dateRow}>
                        <Ionicons name="arrow-down-circle-outline" size={16} color="#10b981" />
                        <Text style={styles.dateText}>
                            คืน: {new Date(item.return_date).toLocaleDateString('th-TH', {
                                year: 'numeric', month: 'short', day: 'numeric',
                            })}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color="#0f172a" />
                        <Text style={styles.back}>กลับ</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>ประวัติการยืม-คืน</Text>
                    <View style={{ width: 60 }} />
                </View>

                <FlatList
                    data={transactions}
                    keyExtractor={(item) => String(item.transaction_id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={64} color="#cbd5e1" />
                            <Text style={styles.empty}>ยังไม่มีประวัติการทำรายการ</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backBtn: { flexDirection: 'row', alignItems: 'center' },
    back: { color: '#0f172a', fontSize: 16, fontWeight: '600' },
    headerTitle: { color: '#0f172a', fontSize: 18, fontWeight: 'bold' },
    listContainer: { padding: 16 },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#475569',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    bookTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0f172a' },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    borrowing: { backgroundColor: '#fef3c7' },
    returned: { backgroundColor: '#d1fae5' },
    badgeText: { fontSize: 12, fontWeight: '700' },
    borrowingText: { color: '#d97706' },
    returnedText: { color: '#059669' },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: { fontSize: 13, color: '#64748b', marginLeft: 6, fontWeight: '500' },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    empty: { color: '#94a3b8', fontSize: 16, marginTop: 16, fontWeight: '500' },
});
