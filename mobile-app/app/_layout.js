import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Data Mahasiswa',
          }}
        />
        <Stack.Screen
          name="students/[id]/scores"
          options={{
            title: 'Nilai Akademik',
          }}
        />
      </Stack>
    </>
  );
}