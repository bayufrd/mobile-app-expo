import Constants from 'expo-constants';

const configuredApiBaseUrl =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  Constants.manifest2?.extra?.expoClient?.extra?.apiBaseUrl ||
  'https://l5x6nfnr-3000.asse.devtunnels.ms/api';

export const API_BASE_URL = String(configuredApiBaseUrl).replace(/\/$/, '');

export const DEFAULT_FORM = {
  nim: '',
  name: '',
  studyProgram: '',
  semester: '',
  gpa: '',
};