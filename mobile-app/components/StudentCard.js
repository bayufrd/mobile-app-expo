import { Pressable, StyleSheet, Text, View } from 'react-native';

export function StudentCard({ item, onEdit, onDelete, onManageScores }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.nim}>NIM: {item.nim}</Text>
        </View>
        <View style={[styles.badge, item.hasAcademicScores ? styles.lockedBadge : styles.openBadge]}>
          <Text style={styles.badgeText}>{item.hasAcademicScores ? 'Ada Nilai' : 'Bisa Hapus'}</Text>
        </View>
      </View>
      <Text style={styles.detail}>Program Studi: {item.studyProgram}</Text>
      <Text style={styles.detail}>Semester: {item.semester}</Text>
      <Text style={styles.detail}>IPK: {Number(item.gpa).toFixed(2)}</Text>
      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.scoreButton]} onPress={() => onManageScores(item)}>
          <Text style={styles.buttonText}>Kelola Nilai</Text>
        </Pressable>
      </View>
      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.editButton]} onPress={() => onEdit(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.deleteButton]} onPress={() => onDelete(item)}>
          <Text style={styles.buttonText}>Hapus</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  nim: {
    marginTop: 4,
    fontSize: 13,
    color: '#475569',
  },
  detail: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 5,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  lockedBadge: {
    backgroundColor: '#fee2e2',
  },
  openBadge: {
    backgroundColor: '#dcfce7',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  scoreButton: {
    backgroundColor: '#0f766e',
  },
  editButton: {
    backgroundColor: '#2563eb',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
