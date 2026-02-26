import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getBorrowingByUser, returnBook } from '../src/database/db';
import { useAuth } from '../src/context/AuthContext';

export default function ReturnScreen() {
    const [borrowing, setBorrowing] = useState([]);
    const router = useRouter();
    const { user } = useAuth();

    useFocusEffect(useCallback(() => {
        setBorrowing(getBorrowingByUser(user.user_id));
    }, []));

    const handleReturn = (item) => {
        Alert.alert(
            'ยืนยันการคืน',
            `ต้องการคืน "${item.title}" ใช่ไหม?`,
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'ยืนยัน',
                    onPress: () => {
                        returnBook(item.transaction_id, item.book_id);
                        Alert.alert('สำเร็จ', 'คืนหนังสือเรียบร้อยแล้ว');
                        setBorrowing(getBorrowingByUser(user.user_id));
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.bookIconContainer}>
                <Ionicons name="book" size={28} color="#f59e0b" />
            </View>
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <View style={styles.dateBadge}>
                    <Ionicons name="calendar-outline" size={12} color="#64748b" />
                    <Text style={styles.date}>
                        ยืมเมื่อ: {new Date(item.borrow_date).toLocaleDateString('th-TH')}
                    </Text>
                </View>
            </View>
            <TouchableOpacity style={styles.returnBtn} onPress={() => handleReturn(item)}>
                <Text style={styles.returnBtnText}>คืน</Text>
            </TouchableOpacity>
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
                    <Text style={styles.headerTitle}>คืนหนังสือ</Text>
                    <View style={{ width: 60 }} />
                </View>

                <View style={styles.instructionBanner}>
                    <Ionicons name="alert-circle-outline" size={20} color="#f59e0b" />
                    <Text style={styles.instructionText}>หนังสือที่คุณกำลังยืมแสดงอยู่ด้านล่าง</Text>
                </View>

                <FlatList
                    data={borrowing}
                    keyExtractor={(item) => String(item.transaction_id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="checkmark-circle-outline" size={64} color="#10b981" />
                            <Text style={styles.emptyTitle}>เยี่ยมมาก!</Text>
                            <Text style={styles.empty}>คุณไม่มีหนังสือที่ค้างส่งในขณะนี้</Text>
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
    instructionBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef3c7',
        padding: 12,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    instructionText: { color: '#92400e', fontSize: 13, marginLeft: 8 },
    listContainer: { padding: 16 },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#475569',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    bookIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#fffbeb',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    info: { flex: 1, marginRight: 12 },
    title: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    date: { fontSize: 12, color: '#64748b', marginLeft: 4, fontWeight: '500' },
    returnBtn: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    returnBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginTop: 16, marginBottom: 8 },
    empty: { color: '#64748b', fontSize: 16 },
});
