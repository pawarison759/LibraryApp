import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Area */}
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="library" size={64} color="#3b82f6" />
                </View>
                <Text style={styles.title}>ระบบห้องสมุด</Text>
                <Text style={styles.subtitle}>Mobile Library Borrow-Return System</Text>
            </View>

            {/* Selection Cards */}
            <View style={styles.cardContainer}>
                {/* Member Login Card */}
                <TouchableOpacity
                    style={[styles.card, styles.memberCard]}
                    onPress={() => router.push('/login')}
                    activeOpacity={0.8}
                >
                    <View style={styles.cardIconBox}>
                        <Ionicons name="person-circle" size={42} color="#3b82f6" />
                    </View>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>เข้าสู่ระบบสมาชิก</Text>
                        <Text style={styles.cardDesc}>ยืม-คืนหนังสือ, ดูประวัติการยืม</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
                </TouchableOpacity>

                {/* Admin Login Card */}
                <TouchableOpacity
                    style={[styles.card, styles.adminCard]}
                    onPress={() => router.push('/admin-login')}
                    activeOpacity={0.8}
                >
                    <View style={[styles.cardIconBox, styles.adminIconBox]}>
                        <Ionicons name="shield-checkmark" size={42} color="#f8fafc" />
                    </View>
                    <View style={styles.cardTextContainer}>
                        <Text style={[styles.cardTitle, styles.adminTitle]}>ผู้ดูแลระบบ</Text>
                        <Text style={[styles.cardDesc, styles.adminDesc]}>จัดการหนังสือ, ดูข้อมูลสมาชิก</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#475569" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc', // Very light slate
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
        width: '100%',
        paddingHorizontal: 24,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#eff6ff', // Light blue background for icon
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0f172a', // Dark slate
        marginBottom: 8,
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        fontWeight: '500',
    },
    cardContainer: {
        width: '100%',
        paddingHorizontal: 24,
        gap: 20,
    },
    card: {
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#475569',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 6,
    },
    memberCard: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    adminCard: {
        backgroundColor: '#1e293b', // Dark slate for admin
    },
    cardIconBox: {
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    adminIconBox: {
        // any specific overrides if needed
    },
    cardTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
    adminTitle: {
        color: '#f8fafc',
    },
    adminDesc: {
        color: '#94a3b8',
    }
});
