import { Categoria } from '@/models/Categoria';
import { Documento } from '@/models/Documento';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StoreState {
  apiUrl: string | null;
  sessionHash: string | null;
  categorias: Categoria[]; // You can define a more specific type for categorias
  tipoDocumentos: Documento[]; // You can define a more specific type for tipoDocumentos
  setApiUrl: (url: string) => void;
  setSessionHash: (hash: string) => void;
  setCategorias: (categories: any[]) => void;
  setTipoDocumentos: (documentTypes: any[]) => void;
  reset: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      apiUrl: "https://scpp.lezora.cl",
      sessionHash: null,
      categorias: [],
      tipoDocumentos: [],
      setApiUrl: (url) => set({ apiUrl: url }),
      setSessionHash: (hash) => set({ sessionHash: hash }),
      setCategorias: (categories) => set({ categorias: categories }),
      setTipoDocumentos: (documentTypes) => set({ tipoDocumentos: documentTypes }),
      reset: () => set({
        apiUrl: null,
        sessionHash: null,
        categorias: [],
        tipoDocumentos: [],
      }),
    }),
    {
      name: 'scpp-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
