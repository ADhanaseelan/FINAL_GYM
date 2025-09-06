// src/Shared/formdata.ts
import { create } from "zustand";

interface UserForm {
  userId?: string;
  name?: string;
  phone?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  gender?: string;
  trainerType?: string;
  candidateType?: string;
  Goal?: string;
  premiumType?: string;
  dateOfJoining?: string;
  address?: string;
  height?: string;
  weight?: string;
  email?: string;
  password?: string;
  dietPlan?: string;
  workoutPlan?: string;
  membershipType?: string;
  startDate?: string;
  endDate?: string;
  amount?: string;
  duration?: string;
  paymentType?: string;
  status?: string;
  date?: string;
}

interface FormStore {
  formData: UserForm;
  setFormData: (data: Partial<UserForm>) => void;
  resetFormData: () => void;
}

const LOCAL_STORAGE_KEY = "userFormData";

export const useFormDataStore = create<FormStore>((set) => ({
  formData: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"),
  setFormData: (data) =>
    set((state) => {
      const updated = { ...state.formData, ...data };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { formData: updated };
    }),
  resetFormData: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    set({ formData: {} });
  },
}));
