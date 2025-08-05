import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import useStore from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { DateTime } from "luxon";
import { useCallback, useMemo, useRef, useState } from 'react';
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
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '90%'], []);
    const colorScheme = useColorScheme();

    const { categorias } = useStore();
    const [searchPhrase, setSearchPhrase] = useState<string | undefined>(initialSearchPhrase);
    const [fechaInicio, setFechaInicio] = useState<DateTime | null>(initialFechaInicio ?? null);
    const [fechaTermino, setFechaTermino] = useState<DateTime | null>(initialFechaTermino ?? null);
    const [categoriaFilterId, setCategoriaFilterId] = useState<number | null>(initialCategoriaFilterId);
    const [searchPhraseIgnoreOtherFilters, setSearchPhraseIgnoreOtherFilters] = useState(true);
    const [showCategoriaPicker, setShowCategoriaPicker] = useState(false);

    const listOfCategoria = [{ id: -1, descripcion: "(Todos)" }, ...categorias];

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

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            onDismiss();
        }
    }, [onDismiss]);

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
        []
    );

    const selectedCategoriaName = listOfCategoria.find(c => c.id === categoriaFilterId)?.descripcion || '(Todos)';
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={visible ? 0 : -1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: themeColors.background }}
            handleIndicatorStyle={{ backgroundColor: themeColors.text }}
        >
            <BottomSheetView style={{ flex: 1, backgroundColor: themeColors.background }} className="p-5">
                <ThemedText type="title" className="mb-5">Filtros</ThemedText>

                <View className="flex-row mb-3 items-center">
                    <TextInput
                        placeholder="Buscar..."
                        value={searchPhrase}
                        onChangeText={setSearchPhrase}
                        className="flex-1 border border-gray-400 rounded p-2 text-black dark:text-white dark:border-gray-600"
                        placeholderTextColor={themeColors.text}
                    />
                    <TouchableOpacity onPress={() => setSearchPhraseIgnoreOtherFilters(!searchPhraseIgnoreOtherFilters)} className="p-2 ml-2">
                        <Ionicons name={searchPhraseIgnoreOtherFilters ? "checkbox" : "square-outline"} size={24} color={themeColors.tint} />
                    </TouchableOpacity>
                    <ThemedText>Solo búsqueda</ThemedText>
                </View>

                <ThemedText className="mb-1">Categoría</ThemedText>
                <TouchableOpacity onPress={() => setShowCategoriaPicker(true)} className="border border-gray-400 rounded p-3 mb-3 dark:border-gray-600">
                    <ThemedText>{selectedCategoriaName}</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleFilterUpdate} className="bg-blue-500 p-3 rounded-lg items-center mt-auto">
                    <ThemedText type="default" className="text-white">Aplicar Filtros</ThemedText>
                </TouchableOpacity>

                <Modal
                    visible={showCategoriaPicker}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowCategoriaPicker(false)}
                >
                    <Pressable onPress={() => setShowCategoriaPicker(false)} style={StyleSheet.absoluteFill} className="bg-black/70" />
                    <View className="flex-1 justify-center items-center">
                        <ThemedView className="m-10 p-5 rounded-lg w-10/12">
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
                    </View>
                </Modal>
            </BottomSheetView>
        </BottomSheet>
    );
}