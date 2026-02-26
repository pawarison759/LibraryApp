import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addBook } from '../src/database/db';

export default function AdminAddBookScreen() {
    const [title, setTitle] = useState('');
    const router = useRouter();

    const handleAdd = () => {
        if (!title.trim()) {
            Alert.alert('ข้อผิดพลาด', 'กรุณากรอกชื่อหนังสือก่อน');
            return;
        }
        addBook(title.trim());
        Alert.alert('สำเร็จ', `เพิ่ม "${title.trim()}" เรียบร้อยแล้ว`, [
            { text: 'เพิ่มอีก', onPress: () => setTitle('') },
            { text: 'กลับไปหน้าเมนู', onPress: () => router.back() },
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="chevron-back" size={24} color="#f8fafc" />
                            <Text style={styles.back}>กลับ</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>เพิ่มหนังสือใหม่</Text>
                        <View style={{ width: 60 }} />
                    </View>

                    <View style={styles.content}>
                        <View style={styles.formCard}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="add-circle" size={56} color="#3b82f6" />
                            </View>

                            <View style={styles.inputSection}>
                                <Text style={styles.label}>ชื่อหนังสือ</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="book-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="กรอกชื่อหนังสือ..."
                                        placeholderTextColor="#64748b"
                                        value={title}
                                        onChangeText={setTitle}
                                        multiline
                                    />
                                </View>
                                <View style={styles.noteContainer}>
                                    <Ionicons name="information-circle-outline" size={16} color="#64748b" />
                                    <Text style={styles.note}>หนังสือใหม่จะถูกเพิ่มด้วยสถานะ "ว่าง" โดยอัตโนมัติ</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.btn} onPress={handleAdd} activeOpacity={0.8}>
                                <Ionicons name="save-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                                <Text style={styles.btnText}>เก็บบันทึกหนังสือ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0f172a' },
    keyboardView: { flex: 1 },
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
    content: { padding: 24, flex: 1 },
    formCard: {
        backgroundColor: '#1e293b',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#334155',
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 2,
        borderColor: '#3b82f6',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    inputSection: { width: '100%', marginBottom: 32 },
    label: { alignSelf: 'flex-start', fontSize: 14, fontWeight: '600', color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase' },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#0f172a',
        borderWidth: 1.5,
        borderColor: '#334155',
        borderRadius: 16,
        padding: 16,
        minHeight: 80,
    },
    inputIcon: { marginRight: 12, marginTop: 2 },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#f8fafc',
        textAlignVertical: 'top',
        minHeight: 44,
    },
    noteContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    note: { fontSize: 13, color: '#64748b', marginLeft: 6 },
    btn: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#3b82f6',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    btnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
