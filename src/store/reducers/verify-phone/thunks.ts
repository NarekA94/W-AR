import {createAsyncThunk} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';

export const verifyPhoneNumber = createAsyncThunk(
  'verifyPhone/verifyPhoneNumber',
  async (phoneNumber: string) => {
    const confirmation = await auth().verifyPhoneNumber(phoneNumber);
    return confirmation;
  },
);
