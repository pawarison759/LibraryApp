import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';

export default function AdminDashboard() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    const menus = [
        { icon: 'people', title: 'ข้อมูลสมาชิก', desc: 'ดูรายชื่อสมาชิกทั้งหมด', route: '/admin-members', color: '#10b981' },
        { icon: 'add-circle', title: 'เพิ่มหนังสือใหม่', desc: 'เพิ่มหนังสือเข้าระบบ', route: '/admin-add-book', color: '#3b82f6' },
        { icon: 'library', title: 'รายการยืมหนังสือ', desc: 'ดูรายงานหนังสือที่ถูกยืม', route: '/admin-borrowed', color: '#f59e0b' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                        <Ionicons name="log-out-outline" size={20} color="#94a3b8" />
                        <Text style={styles.logoutText}>ออกจากระบบ</Text>
                    </TouchableOpacity>

                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.greeting}>สวัสดี, {user?.username} 👋</Text>
                            <Text style={styles.headerTitle}>แผงควบคุมผู้ดูแล</Text>
                        </View>
                        <View style={styles.avatar}>
                            <Ionicons name="shield-checkmark" size={24} color="#f8fafc" />
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>เมนูจัดการระบบ</Text>
                    {menus.map((m) => (
                        <TouchableOpacity key={m.route} style={styles.menuCard} onPress={() => router.push(m.route)} activeOpacity={0.8}>
                            <View style={[styles.menuIconBox, { backgroundColor: m.color + '20' }]}>
                                <Ionicons name={m.icon} size={28} color={m.color} />
                            </View>
                            <View style={styles.menuInfo}>
                                <Text style={styles.menuTitle}>{m.title}</Text>
                                <Text style={styles.menuDesc}>{m.desc}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#475569" />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0f172a' },
    container: { flex: 1, backgroundColor: '#0f172a' },
    header: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    logoutText: { color: '#94a3b8', fontSize: 14, fontWeight: '600', marginLeft: 6 },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    greeting: { color: '#94a3b8', fontSize: 16, marginBottom: 4 },
    headerTitle: { color: '#f8fafc', fontSize: 24, fontWeight: 'bold' },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#60a5fa',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    content: { padding: 24 },
    sectionTitle: { color: '#94a3b8', fontSize: 14, fontWeight: '600', marginBottom: 16, textTransform: 'uppercase' },
    menuCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#334155',
    },
    menuIconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuInfo: { flex: 1 },
    menuTitle: { fontSize: 18, fontWeight: '700', color: '#f8fafc', marginBottom: 4 },
    menuDesc: { fontSize: 13, color: '#94a3b8' },
});
