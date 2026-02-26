import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loginUser } from '../src/database/db';
import { useAuth } from '../src/context/AuthContext';

export default function AdminLoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleLogin = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
        ]).start(() => {
            if (!username.trim() || !password.trim()) {
                Alert.alert('ข้อผิดพลาด', 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบ');
                return;
            }
            const user = loginUser(username.trim(), password.trim());
            if (!user) {
                Alert.alert('ข้อผิดพลาด', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
                return;
            }
            if (user.role !== 'admin') {
                Alert.alert('ข้อผิดพลาด', 'บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ');
                return;
            }
            login(user);
            router.replace('/admin-dashboard');
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#94a3b8" />
                    <Text style={styles.backText}>กลับ</Text>
                </TouchableOpacity>

                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="shield-checkmark" size={56} color="#3b82f6" />
                        </View>
                        <Text style={styles.title}>ผู้ดูแลระบบ</Text>
                        <Text style={styles.subtitle}>กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูล</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Ionicons name="shield-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="ชื่อผู้ใช้ Admin"
                                placeholderTextColor="#64748b"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="รหัสผ่าน"
                                placeholderTextColor="#64748b"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                                <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <TouchableOpacity style={styles.btn} onPress={handleLogin} activeOpacity={0.8}>
                                <Text style={styles.btnText}>เข้าสู่ระบบ</Text>
                                <Ionicons name="log-in-outline" size={20} color="#ffffff" style={styles.btnIcon} />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0f172a' },
    keyboardView: { flex: 1 },
    backBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 10 : 30,
        left: 20,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10
    },
    backText: { color: '#94a3b8', fontSize: 16, fontWeight: '700', marginLeft: 4 },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    title: { fontSize: 32, fontWeight: '900', color: '#f8fafc', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#94a3b8', fontWeight: '500' },
    formContainer: {
        backgroundColor: '#1e293b',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        borderWidth: 1.5,
        borderColor: '#334155',
        borderRadius: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: { marginRight: 12 },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#f8fafc',
        height: '100%',
    },
    eyeIcon: { padding: 8 },
    btn: {
        flexDirection: 'row',
        backgroundColor: '#3b82f6',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    btnText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
    btnIcon: { marginLeft: 8 },
});
