
import { Colors } from '@/constants/Colors';
import { Categoria } from '@/models/Categoria';
import useStore from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { DateTime } from "luxon";
import { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface FiltersModalProps {
    visible: boolean;
    onDismiss: () => void;
    onFilterUpdate: (filters: {
        searchPhrase: string | undefined;
        categoriaFilterId: number | null;
        fechaInicio: DateTime | null;
        fechaTermino: DateTime | null;
        searchPhraseIgnoreOtherFilters: boolean;
    }) => void;
    initialSearchPhrase?: string;
    initialCategoriaFilterId: number | null;
    initialFechaInicio?: DateTime | null;
    initialFechaTermino?: DateTime | null;
}

export default function ListDocsFilters({
    visible,
    onDismiss,
    onFilterUpdate,
    initialSearchPhrase,
    initialCategoriaFilterId,
    initialFechaInicio,
    initialFechaTermino
}: FiltersModalProps) {

    const { sessionHash, apiUrl } = useStore();
    const [searchPhrase, setSearchPhrase] = useState<string | undefined>(initialSearchPhrase);
    const [fechaInicio, setFechaInicio] = useState<DateTime | null>(initialFechaInicio ?? null);
    const [fechaTermino, setFechaTermino] = useState<DateTime | null>(initialFechaTermino ?? null);
    const [categoriaFilterId, setCategoriaFilterId] = useState<number | null>(initialCategoriaFilterId);
    const [listOfCategoria, setListOfCategoria] = useState<Categoria[]>([]);
    const [searchPhraseIgnoreOtherFilters, setSearchPhraseIgnoreOtherFilters] = useState(true);
    const [showCategoriaPicker, setShowCategoriaPicker] = useState(false);

    useEffect(() => {
        const getCategorias = async () => {
            if (!sessionHash) return;
            try {
                const response = await axios.get(`${apiUrl}/categorias`, { params: { sessionHash } });
                const modifiedData = [{ id: -1, descripcion: "(Todos)" }, ...response.data];
                setListOfCategoria(modifiedData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        getCategorias();
    }, [apiUrl, sessionHash]);

    const handleFilterUpdate = () => {
        onFilterUpdate({
            searchPhrase,
            categoriaFilterId,
            fechaInicio,
            fechaTermino,
            searchPhraseIgnoreOtherFilters
        });
        onDismiss();
    };

    const selectedCategoriaName = listOfCategoria.find(c => c.id === categoriaFilterId)?.descripcion || '(Todos)';

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onDismiss}
        >
            <Pressable onPress={onDismiss} style={StyleSheet.absoluteFill} className="bg-black/50" />
            <ThemedView className="m-5 p-5 rounded-2xl flex-1 mt-20">
                <ThemedText type="title" className="mb-5">Filtros</ThemedText>

                <View className="flex-row mb-3 items-center">
                    <TextInput
                        placeholder="Buscar..."
                        value={searchPhrase}
                        onChangeText={setSearchPhrase}
                        className="flex-1 border border-gray-400 rounded p-2 dark:text-white dark:border-gray-600"
                        placeholderTextColor={Colors.light.text}
                    />
                    <TouchableOpacity onPress={() => setSearchPhraseIgnoreOtherFilters(!searchPhraseIgnoreOtherFilters)} className="p-2 ml-2">
                        <Ionicons name={searchPhraseIgnoreOtherFilters ? "checkbox" : "square-outline"} size={24} color={Colors.light.tint} />
                    </TouchableOpacity>
                    <ThemedText>Solo búsqueda</ThemedText>
                </View>

                {/* Categoria Picker */}
                <ThemedText className="mb-1">Categoría</ThemedText>
                <TouchableOpacity onPress={() => setShowCategoriaPicker(true)} className="border border-gray-400 rounded p-3 mb-3 dark:border-gray-600">
                    <ThemedText>{selectedCategoriaName}</ThemedText>
                </TouchableOpacity>

                <Modal
                    visible={showCategoriaPicker}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowCategoriaPicker(false)}
                >
                    <Pressable onPress={() => setShowCategoriaPicker(false)} style={StyleSheet.absoluteFill} className="bg-black/70" />
                    <ThemedView className="m-10 p-5 rounded-lg">
                        <FlatList
                            data={listOfCategoria}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setCategoriaFilterId(item.id === -1 ? null : item.id);
                                        setShowCategoriaPicker(false);
                                    }}
                                    className="p-3"
                                >
                                    <ThemedText className="text-lg">{item.descripcion}</ThemedText>
                                </TouchableOpacity>
                            )}
                        />
                    </ThemedView>
                </Modal>

                {/* Date inputs could be added here if a native date picker is implemented */}

                <TouchableOpacity onPress={handleFilterUpdate} className="bg-blue-500 p-3 rounded-lg items-center mt-5">
                    <ThemedText type="default" className="text-white">Aplicar Filtros</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </Modal>
    );
}
