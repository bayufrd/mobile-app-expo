import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StudentCard } from '../components/StudentCard';
import { StudentForm } from '../components/StudentForm';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { createStudent, deleteStudent, getStudents, updateStudent } from '../services/studentApi';

export default function HomeScreen() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const debouncedSearch = useDebouncedValue(search, 450);

  const emptyMessage = useMemo(() => {
    if (debouncedSearch) {
      return 'Data mahasiswa tidak ditemukan untuk kata kunci ini.';
    }

    return 'Belum ada data mahasiswa.';
  }, [debouncedSearch]);

  const fetchStudents = useCallback(async (keyword = debouncedSearch, silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      setErrorMessage('');
      const response = await getStudents(keyword);
      setStudents(response.data || []);
    } catch (error) {
      setErrorMessage(error.message || 'Gagal mengambil data mahasiswa');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchStudents(debouncedSearch);
  }, [debouncedSearch, fetchStudents]);

  function openCreateModal() {
    setSelectedStudent(null);
    setModalVisible(true);
  }

  function openEditModal(student) {
    setSelectedStudent(student);
    setModalVisible(true);
  }

  function closeModal() {
    if (submitting) {
      return;
    }

    setModalVisible(false);
    setSelectedStudent(null);
  }

  async function handleSubmit(values) {
    setSubmitting(true);

    try {
      if (selectedStudent?.id) {
        await updateStudent(selectedStudent.id, values);
      } else {
        await createStudent(values);
      }

      closeModal();
      await fetchStudents(debouncedSearch, true);
    } catch (error) {
      const details = error.details
        ? Object.values(error.details).join('\n')
        : error.message || 'Proses simpan gagal';
      Alert.alert('Gagal menyimpan', details);
    } finally {
      setSubmitting(false);
    }
  }

  function handleDelete(student) {
    Alert.alert(
      'Hapus Mahasiswa',
      `Hapus data ${student.name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStudent(student.id);
              await fetchStudents(debouncedSearch, true);
            } catch (error) {
              const details = error.details
                ? Object.values(error.details).join('\n')
                : error.message || 'Gagal menghapus data';
              Alert.alert('Gagal menghapus', details);
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Manajemen Mahasiswa</Text>
        <Text style={styles.subheading}>
          CRUD real-time dengan validasi NIM unik, semester 1-14, IPK 0.00-4.00, dan proteksi hapus jika sudah punya nilai.
        </Text>

        <View style={styles.searchRow}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari berdasarkan NIM atau nama"
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
          <Pressable style={styles.addButton} onPress={openCreateModal}>
            <Text style={styles.addButtonText}>+ Tambah</Text>
          </Pressable>
        </View>

        {errorMessage ? <Text style={styles.errorBanner}>{errorMessage}</Text> : null}

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Memuat data mahasiswa...</Text>
          </View>
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <StudentCard item={item} onEdit={openEditModal} onDelete={handleDelete} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={students.length === 0 ? styles.emptyListContent : styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchStudents(debouncedSearch, true);
                }}
              />
            }
            ListEmptyComponent={
              <View style={styles.centerBox}>
                <Text style={styles.emptyText}>{emptyMessage}</Text>
              </View>
            }
          />
        )}
      </View>

      <StudentForm
        visible={modalVisible}
        initialValues={selectedStudent}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  subheading: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0f172a',
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  errorBanner: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    color: '#991b1b',
    backgroundColor: '#fee2e2',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#475569',
  },
  listContent: {
    paddingBottom: 32,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 15,
    lineHeight: 22,
  },
});
