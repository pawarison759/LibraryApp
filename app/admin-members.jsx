import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAllUsers } from '../src/database/db';

export default function AdminMembersScreen() {
    const [users, setUsers] = useState([]);
    const router = useRouter();

    useFocusEffect(useCallback(() => {
        setUsers(getAllUsers());
    }, []));

    const renderUser = ({ item }) => (
        <View style={styles.card}>
            <View style={[styles.avatar, item.role === 'admin' ? styles.adminAvatar : styles.memberAvatar]}>
                <Text style={[styles.avatarText, item.role === 'admin' ? styles.adminAvatarText : styles.memberAvatarText]}>
                    {item.username.charAt(0).toUpperCase()}
                </Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.userId}>รหัสบัญชี #{item.user_id}</Text>
            </View>
            <View style={[styles.badge, item.role === 'admin' ? styles.adminBadge : styles.memberBadge]}>
                <Ionicons
                    name={item.role === 'admin' ? 'shield-checkmark' : 'person'}
                    size={12}
                    color={item.role === 'admin' ? '#f59e0b' : '#3b82f6'}
                />
                <Text style={[styles.badgeText, item.role === 'admin' ? styles.adminBadgeText : styles.memberBadgeText]}>
                    {item.role === 'admin' ? ' ผู้ดูแล' : ' สมาชิก'}
                </Text>
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
                    <Text style={styles.headerTitle}>ข้อมูลสมาชิก</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.count}>{users.length}</Text>
                    </View>
                </View>

                <FlatList
                    data={users}
                    keyExtractor={(item) => String(item.user_id)}
                    renderItem={renderUser}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={64} color="#475569" />
                            <Text style={styles.empty}>ยังไม่มีสมาชิกในระบบ</Text>
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
        backgroundColor: '#3b82f6',
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
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#334155',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    adminAvatar: { backgroundColor: '#f59e0b20', borderWidth: 1, borderColor: '#fef3c7' },
    memberAvatar: { backgroundColor: '#3b82f620', borderWidth: 1, borderColor: '#dbeafe' },
    avatarText: { fontSize: 20, fontWeight: 'bold' },
    adminAvatarText: { color: '#f59e0b' },
    memberAvatarText: { color: '#3b82f6' },
    info: { flex: 1 },
    username: { fontSize: 16, fontWeight: '700', color: '#f8fafc', marginBottom: 4 },
    userId: { fontSize: 13, color: '#94a3b8' },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20
    },
    adminBadge: { backgroundColor: '#fef3c7' },
    memberBadge: { backgroundColor: '#eff6ff' },
    badgeText: { fontSize: 12, fontWeight: '700' },
    adminBadgeText: { color: '#d97706' },
    memberBadgeText: { color: '#1d4ed8' },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    empty: { textAlign: 'center', color: '#64748b', marginTop: 16, fontSize: 16, fontWeight: '500' },
});
