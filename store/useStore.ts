import { Categoria } from '@/models/Categoria';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StoreState {
  apiUrl: string | null;
  sessionHash: string | null;
  categorias: Categoria[];
  tipoDocumentos: any[]; // Define a proper type if available
  isLoading: boolean;
  error: string | null;
  setApiUrl: (url: string) => void;
  setSessionHash: (hash: string) => void;
  fetchInitialData: () => Promise<void>;
  reset: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      apiUrl: "https://scpp.lezora.cl",
      sessionHash: null,
      categorias: [],
      tipoDocumentos: [],
      isLoading: false,
      error: null,
      setApiUrl: (url) => set({ apiUrl: url }),
      setSessionHash: (hash) => set({ sessionHash: hash }),
      fetchInitialData: async () => {
        const { apiUrl, sessionHash } = get();
        if (!sessionHash || !apiUrl) return;

        set({ isLoading: true, error: null });
        try {
          const [catResponse, tipoDocResponse] = await Promise.all([
            axios.get(`${apiUrl}/categorias`, { params: { sessionHash } }),
            axios.get(`${apiUrl}/tipo-docs`, { params: { sessionHash } })
          ]);

          set({
            categorias: catResponse.data,
            tipoDocumentos: tipoDocResponse.data,
            isLoading: false
          });
        } catch (e: any) {
          console.error("Failed to fetch initial data", e);
          set({ error: e.message, isLoading: false });
        }
      },
      reset: () => set({
        sessionHash: null,
        categorias: [],
        tipoDocumentos: [],
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'scpp-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ apiUrl: state.apiUrl, sessionHash: state.sessionHash }), // Only persist these fields
    }
  )
);

export default useStore;