import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { createStudentScore, getStudentScores } from '../../../services/studentApi';

const COURSE_OPTIONS = [
  'Pemrograman Mobile',
  'Basis Data',
  'Algoritma Lanjut',
  'Manajemen Proyek TI',
  'Jaringan Komputer',
  'Analisis Sistem',
  'Machine Learning Dasar',
  'Kecerdasan Buatan',
  'Pemrograman Web',
  'Struktur Data',
  'Sistem Operasi',
  'Keamanan Informasi',
];

const DEFAULT_FORM = {
  courseName: COURSE_OPTIONS[0],
  score: '',
};

function validate(values) {
  const errors = {};
  const numericScore = Number(values.score);

  if (!values.courseName.trim()) {
    errors.courseName = 'Mata kuliah wajib dipilih';
  }

  if (values.courseName && !COURSE_OPTIONS.includes(values.courseName)) {
    errors.courseName = 'Mata kuliah tidak valid';
  }

  if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
    errors.score = 'Nilai harus 0 sampai 100';
  }

  return errors;
}

function ScoreForm({ visible, onClose, onSubmit, loading }) {
  const [values, setValues] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (visible) {
      setValues(DEFAULT_FORM);
      setErrors({});
    }
  }, [visible]);

  async function handleSubmit() {
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      courseName: values.courseName,
      score: Number(Number(values.score).toFixed(2)),
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Tambah Nilai Akademik</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Mata Kuliah</Text>
              <View style={styles.courseGrid}>
                {COURSE_OPTIONS.map((courseName) => {
                  const active = values.courseName === courseName;
                  return (
                    <Pressable
                      key={courseName}
                      style={[styles.courseChip, active && styles.courseChipActive]}
                      onPress={() => setValues((current) => ({ ...current, courseName }))}
                    >
                      <Text style={[styles.courseChipText, active && styles.courseChipTextActive]}>{courseName}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {errors.courseName ? <Text style={styles.errorText}>{errors.courseName}</Text> : null}
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nilai</Text>
              <TextInput
                value={values.score}
                onChangeText={(score) => setValues((current) => ({ ...current, score }))}
                keyboardType="decimal-pad"
                placeholder="Contoh: 88.5"
                placeholderTextColor="#94a3b8"
                style={[styles.input, errors.score && styles.inputError]}
              />
              {errors.score ? <Text style={styles.errorText}>{errors.score}</Text> : null}
            </View>
          </ScrollView>
          <View style={styles.modalActions}>
            <Pressable style={[styles.button, styles.secondaryButton]} onPress={onClose} disabled={loading}>
              <Text style={styles.secondaryText}>Batal</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.primaryButton, loading && styles.disabledButton]} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.primaryText}>{loading ? 'Menyimpan...' : 'Simpan Nilai'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function StudentScoresScreen() {
  const params = useLocalSearchParams();
  const studentId = Number(params.id);
  const studentName = useMemo(() => String(params.name || 'Mahasiswa'), [params.name]);
  const studentNim = useMemo(() => String(params.nim || '-'), [params.nim]);

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchScores = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      setErrorMessage('');
      const response = await getStudentScores(studentId);
      setScores(response.data || []);
    } catch (error) {
      setErrorMessage(error.message || 'Gagal mengambil nilai akademik');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  async function handleCreateScore(values) {
    setSubmitting(true);

    try {
      await createStudentScore(studentId, values);
      setModalVisible(false);
      await fetchScores(true);
    } catch (error) {
      const details = error.details
        ? Object.values(error.details).join('\n')
        : error.message || 'Gagal menyimpan nilai akademik';
      Alert.alert('Gagal menyimpan nilai', details);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Kelola Nilai Akademik</Text>
          <Text style={styles.heroSubtitle}>{studentName}</Text>
          <Text style={styles.heroMeta}>NIM: {studentNim}</Text>
          <Text style={styles.heroMeta}>Mahasiswa ID: {studentId}</Text>
        </View>

        <View style={styles.actionRow}>
          <Text style={styles.sectionTitle}>Riwayat Nilai</Text>
          <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Nilai</Text>
          </Pressable>
        </View>

        {errorMessage ? <Text style={styles.errorBanner}>{errorMessage}</Text> : null}

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Memuat nilai akademik...</Text>
          </View>
        ) : (
          <FlatList
            data={scores}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={scores.length === 0 ? styles.emptyListContent : styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchScores(true);
                }}
              />
            }
            renderItem={({ item }) => (
              <View style={styles.scoreCard}>
                <Text style={styles.scoreCourse}>{item.courseName}</Text>
                <Text style={styles.scoreValue}>Nilai: {Number(item.score).toFixed(2)}</Text>
                <Text style={styles.scoreTime}>Dicatat: {new Date(item.createdAt).toLocaleString('id-ID')}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.centerBox}>
                <Text style={styles.emptyText}>Belum ada nilai akademik. Tambahkan dari tombol `+ Nilai`.</Text>
              </View>
            }
          />
        )}
      </View>

      <ScoreForm
        visible={modalVisible}
        onClose={() => {
          if (!submitting) {
            setModalVisible(false);
          }
        }}
        onSubmit={handleCreateScore}
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
  heroCard: {
    backgroundColor: '#1d4ed8',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: '700',
    color: '#dbeafe',
  },
  heroMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#bfdbfe',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
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
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  scoreCourse: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  scoreValue: {
    marginTop: 8,
    fontSize: 14,
    color: '#334155',
  },
  scoreTime: {
    marginTop: 6,
    fontSize: 12,
    color: '#64748b',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    marginTop: 6,
    color: '#dc2626',
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },
  courseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courseChip: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#fff',
  },
  courseChipActive: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  courseChipText: {
    fontSize: 13,
    color: '#334155',
  },
  courseChipTextActive: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
});