import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '../src/database/db';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const router = useRouter();

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleRegister = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
        ]).start(() => {
            if (!username.trim() || !password.trim() || !confirm.trim()) {
                Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
                return;
            }
            if (password !== confirm) {
                Alert.alert('ข้อผิดพลาด', 'รหัสผ่านไม่ตรงกัน');
                return;
            }
            if (password.length < 4) {
                Alert.alert('ข้อผิดพลาด', 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร');
                return;
            }
            const result = registerUser(username.trim(), password.trim());
            if (!result.success) {
                Alert.alert('ข้อผิดพลาด', 'ชื่อผู้ใช้นี้มีอยู่แล้ว กรุณาใช้ชื่ออื่น');
                return;
            }
            Alert.alert('สำเร็จ', 'สมัครสมาชิกเรียบร้อยแล้ว', [
                { text: 'เข้าสู่ระบบ', onPress: () => router.replace('/login') },
            ]);
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#0369a1" />
                    <Text style={styles.backText}>กลับ</Text>
                </TouchableOpacity>

                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="person-add" size={50} color="#0284c7" style={{ marginLeft: 6 /* simple optical alignment */ }} />
                        </View>
                        <Text style={styles.title}>สมัครสมาชิก</Text>
                        <Text style={styles.subtitle}>สร้างบัญชีใหม่เพื่อยืม-คืนหนังสือ</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Ionicons name="person-outline" size={20} color="#64748b" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="ชื่อผู้ใช้งาน"
                                placeholderTextColor="#94a3b8"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="รหัสผ่าน (อย่างน้อย 4 ตัวอักษร)"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                                <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#64748b" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="ยืนยันรหัสผ่าน"
                                placeholderTextColor="#94a3b8"
                                value={confirm}
                                onChangeText={setConfirm}
                                secureTextEntry={!isConfirmVisible}
                            />
                            <TouchableOpacity onPress={() => setIsConfirmVisible(!isConfirmVisible)} style={styles.eyeIcon}>
                                <Ionicons name={isConfirmVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <TouchableOpacity style={styles.btn} onPress={handleRegister} activeOpacity={0.8}>
                                <Text style={styles.btnText}>สมัครสมาชิก</Text>
                                <Ionicons name="create-outline" size={20} color="#ffffff" style={styles.btnIcon} />
                            </TouchableOpacity>
                        </Animated.View>

                        <View style={styles.footer}>
                            <Text style={styles.linkText}>มีบัญชีแล้ว? </Text>
                            <TouchableOpacity onPress={() => router.replace('/login')}>
                                <Text style={styles.link}>เข้าสู่ระบบ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f0f9ff' },
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
    backText: { color: '#0369a1', fontSize: 16, fontWeight: '700', marginLeft: 4 },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e0f2fe',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    title: { fontSize: 32, fontWeight: '900', color: '#0c4a6e', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#0284c7', fontWeight: '500' },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#e0f2fe',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: { marginRight: 12 },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#0f172a',
        height: '100%',
    },
    eyeIcon: { padding: 8 },
    btn: {
        flexDirection: 'row',
        backgroundColor: '#0284c7',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#0284c7',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    btnText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
    btnIcon: { marginLeft: 8 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    linkText: { color: '#64748b', fontSize: 16 },
    link: { color: '#0284c7', fontSize: 16, fontWeight: 'bold' },
});
