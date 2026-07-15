import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { DEFAULT_FORM } from '../constants/api';

function validate(values) {
  const errors = {};
  const semester = Number(values.semester);
  const gpa = Number(values.gpa);

  if (!values.nim.trim()) errors.nim = 'NIM wajib diisi';
  if (!values.name.trim()) errors.name = 'Nama wajib diisi';
  if (!values.studyProgram.trim()) errors.studyProgram = 'Program studi wajib diisi';
  if (!Number.isInteger(semester) || semester < 1 || semester > 14) {
    errors.semester = 'Semester harus 1 sampai 14';
  }
  if (Number.isNaN(gpa) || gpa < 0 || gpa > 4) {
    errors.gpa = 'IPK harus 0.00 sampai 4.00';
  }

  return errors;
}

export function StudentForm({ visible, initialValues, onClose, onSubmit, loading }) {
  const editing = useMemo(() => Boolean(initialValues?.id), [initialValues]);
  const [values, setValues] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (visible) {
      setValues(
        initialValues
          ? {
              nim: String(initialValues.nim ?? ''),
              name: String(initialValues.name ?? ''),
              studyProgram: String(initialValues.studyProgram ?? ''),
              semester: String(initialValues.semester ?? ''),
              gpa: String(initialValues.gpa ?? ''),
            }
          : DEFAULT_FORM
      );
      setErrors({});
    }
  }, [initialValues, visible]);

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      nim: values.nim.trim(),
      name: values.name.trim(),
      studyProgram: values.studyProgram.trim(),
      semester: Number(values.semester),
      gpa: Number(Number(values.gpa).toFixed(2)),
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{editing ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Field label="NIM" value={values.nim} onChangeText={(value) => updateField('nim', value)} error={errors.nim} />
            <Field label="Nama Mahasiswa" value={values.name} onChangeText={(value) => updateField('name', value)} error={errors.name} />
            <Field label="Program Studi" value={values.studyProgram} onChangeText={(value) => updateField('studyProgram', value)} error={errors.studyProgram} />
            <Field label="Semester" value={values.semester} onChangeText={(value) => updateField('semester', value)} keyboardType="number-pad" error={errors.semester} />
            <Field label="IPK" value={values.gpa} onChangeText={(value) => updateField('gpa', value)} keyboardType="decimal-pad" error={errors.gpa} />
          </ScrollView>
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.secondaryButton]} onPress={onClose} disabled={loading}>
              <Text style={styles.secondaryText}>Batal</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.primaryButton, loading && styles.disabledButton]} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.primaryText}>{loading ? 'Menyimpan...' : 'Simpan'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, error, ...props }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, error && styles.inputError]} placeholder={label} placeholderTextColor="#94a3b8" {...props} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  title: {
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
  actions: {
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
});
