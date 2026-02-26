import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAllBooks, borrowBook } from '../src/database/db';
import { useAuth } from '../src/context/AuthContext';

export default function BorrowScreen() {
    const [books, setBooks] = useState([]);
    const router = useRouter();
    const { user } = useAuth();

    useFocusEffect(useCallback(() => {
        setBooks(getAllBooks());
    }, []));

    const handleBorrow = (book) => {
        if (book.status !== 'available') {
            Alert.alert('ไม่สามารถยืมได้', 'หนังสือเล่มนี้ถูกยืมไปแล้ว กรุณาเลือกเล่มอื่น');
            return;
        }
        Alert.alert(
            'ยืนยันการยืม',
            `ต้องการยืม "${book.title}" ใช่ไหม?`,
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'ยืนยัน',
                    onPress: () => {
                        const result = borrowBook(user.user_id, book.book_id);
                        if (result.success) {
                            Alert.alert('สำเร็จ', 'ยืมหนังสือเรียบร้อยแล้ว');
                            setBooks(getAllBooks());
                        } else {
                            Alert.alert('ข้อผิดพลาด', result.error);
                        }
                    },
                },
            ]
        );
    };

    const renderBook = ({ item }) => (
        <View style={styles.bookCard}>
            <View style={styles.bookIconContainer}>
                <Ionicons name="book-outline" size={28} color="#64748b" />
            </View>
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
                <View style={[styles.badge, item.status === 'available' ? styles.available : styles.borrowed]}>
                    <Ionicons
                        name={item.status === 'available' ? 'checkmark-circle' : 'close-circle'}
                        size={12}
                        color={item.status === 'available' ? '#059669' : '#dc2626'}
                    />
                    <Text style={[styles.badgeText, item.status === 'available' ? styles.availableText : styles.borrowedText]}>
                        {item.status === 'available' ? ' ว่าง' : ' ถูกยืมแล้ว'}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                style={[styles.borrowBtn, item.status !== 'available' && styles.borrowBtnDisabled]}
                onPress={() => handleBorrow(item)}
                disabled={item.status !== 'available'}
            >
                <Text style={[styles.borrowBtnText, item.status !== 'available' && styles.borrowBtnTextDisabled]}>ยืม</Text>
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
                    <Text style={styles.headerTitle}>ยืมหนังสือ</Text>
                    <View style={{ width: 60 }} />
                </View>

                <View style={styles.instructionBanner}>
                    <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
                    <Text style={styles.instructionText}>เลือกหนังสือที่คุณต้องการยืมจากรายการด้านล่าง</Text>
                </View>

                <FlatList
                    data={books}
                    keyExtractor={(item) => String(item.book_id)}
                    renderItem={renderBook}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="sad-outline" size={64} color="#cbd5e1" />
                            <Text style={styles.empty}>ไม่มีหนังสือในระบบ</Text>
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
        backgroundColor: '#eff6ff',
        padding: 12,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
    },
    instructionText: { color: '#1e40af', fontSize: 13, marginLeft: 8 },
    listContainer: { padding: 16 },
    bookCard: {
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
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    bookInfo: { flex: 1, marginRight: 12 },
    bookTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
    badge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20
    },
    available: { backgroundColor: '#d1fae5' },
    borrowed: { backgroundColor: '#fee2e2' },
    badgeText: { fontSize: 12, fontWeight: '700' },
    availableText: { color: '#059669' },
    borrowedText: { color: '#dc2626' },
    borrowBtn: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    borrowBtnDisabled: { backgroundColor: '#e2e8f0' },
    borrowBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
    borrowBtnTextDisabled: { color: '#94a3b8' },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    empty: { textAlign: 'center', color: '#94a3b8', marginTop: 16, fontSize: 16, fontWeight: '500' },
});
