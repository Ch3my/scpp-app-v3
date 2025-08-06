
import { Categoria } from '@/models/Categoria';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StoreState {
  apiUrl: string | null;
  sessionHash: string | null;
  categorias: Categoria[];
  tipoDocumentos: any[];
  isLoading: boolean;
  error: string | null;
  docsNeedRefetch: boolean;
  setApiUrl: (url: string) => void;
  setSessionHash: (hash: string) => void;
  setDocsNeedRefetch: (needsRefetch: boolean) => void;
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
      docsNeedRefetch: false,
      setApiUrl: (url) => set({ apiUrl: url }),
      setSessionHash: (hash) => set({ sessionHash: hash }),
      setDocsNeedRefetch: (needsRefetch) => set({ docsNeedRefetch: needsRefetch }),
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
        docsNeedRefetch: false,
      }),
    }),
    {
      name: 'scpp-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ apiUrl: state.apiUrl, sessionHash: state.sessionHash }),
    }
  )
);

export default useStore;
