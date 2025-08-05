import CategoriaSheet from "@/components/CategoriaSheet";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TipoDocSheet from "@/components/TipoDocSheet";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import useStore from "@/store/useStore";
import BottomSheet from "@gorhom/bottom-sheet";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Stack, useRouter } from "expo-router";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity } from "react-native";

const AddDoc = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const { sessionHash, apiUrl, tipoDocumentos, categorias } = useStore();

    const [proposito, setProposito] = useState('');
    const [monto, setMonto] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [tipoDocId, setTipoDocId] = useState<number>(1);
    const [categoriaId, setCategoriaId] = useState<number | null>(null);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTipoDocSheet, setShowTipoDocSheet] = useState(false);
    const [showCategoriaSheet, setShowCategoriaSheet] = useState(false);

    const tipoDocBottomSheetRef = useRef<BottomSheet>(null);
    const categoriaBottomSheetRef = useRef<BottomSheet>(null);

    const mutation = useMutation({
        mutationFn: (newDoc: any) => axios.post(`${apiUrl}/documentos`, newDoc),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            router.back();
        },
        onError: (error) => {
            console.error("Error saving document:", error);
            // Handle error, e.g., show a snackbar
        },
    });

    const handleSave = () => {
        if (!proposito || !monto) {
            // Handle validation error
            return;
        }
        const newDoc = {
            sessionHash,
            proposito,
            monto: parseFloat(monto),
            fecha: DateTime.fromJSDate(fecha).toFormat('yyyy-MM-dd'),
            fk_tipoDoc: tipoDocId,
            fk_categoria: categoriaId,
        };
        mutation.mutate(newDoc);
    };

    const selectedTipoDoc = tipoDocumentos.find(td => td.id === tipoDocId);
    const selectedCategoria = categorias.find(c => c.id === categoriaId);

    return (
        <ThemedView className="flex-1 p-4">
            <Stack.Screen options={{ headerTitle: "Agregar Documento" }} />
            <ScrollView>
                <ThemedText className="mb-2">Propósito</ThemedText>
                <TextInput
                    value={proposito}
                    onChangeText={setProposito}
                    className="border border-gray-400 rounded p-2 mb-4 dark:text-white dark:border-gray-600"
                    placeholder="Ej: Compra de insumos"
                    placeholderTextColor={themeColors.text}
                />

                <ThemedText className="mb-2">Monto</ThemedText>
                <TextInput
                    value={monto}
                    onChangeText={setMonto}
                    className="border border-gray-400 rounded p-2 mb-4 dark:text-white dark:border-gray-600"
                    placeholder="10000"
                    keyboardType="numeric"
                    placeholderTextColor={themeColors.text}
                />

                <ThemedText className="mb-2">Fecha</ThemedText>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border border-gray-400 rounded p-2 mb-4 dark:border-gray-600">
                    <ThemedText>{DateTime.fromJSDate(fecha).toFormat('dd-MM-yyyy')}</ThemedText>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={fecha}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                setFecha(selectedDate);
                            }
                        }}
                    />
                )}

                <ThemedText className="mb-2">Tipo de Documento</ThemedText>
                <TouchableOpacity onPress={() => tipoDocBottomSheetRef.current?.expand()} className="border border-gray-400 rounded p-2 mb-4 dark:border-gray-600">
                    <ThemedText>{selectedTipoDoc?.proposito || 'Seleccionar...'}</ThemedText>
                </TouchableOpacity>

                {tipoDocId === 1 && (
                    <>
                        <ThemedText className="mb-2">Categoría</ThemedText>
                        <TouchableOpacity onPress={() => categoriaBottomSheetRef.current?.expand()} className="border border-gray-400 rounded p-2 mb-4 dark:border-gray-600">
                            <ThemedText>{selectedCategoria?.descripcion || 'Seleccionar...'}</ThemedText>
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity onPress={handleSave} className="bg-blue-500 p-3 rounded-lg items-center mt-4">
                    <ThemedText className="text-white">Guardar</ThemedText>
                </TouchableOpacity>
            </ScrollView>

            <TipoDocSheet
                ref={tipoDocBottomSheetRef}
                onUpdateTipoDoc={({ id }) => {
                    setTipoDocId(id);
                    tipoDocBottomSheetRef.current?.close();
                }}
            />

            <CategoriaSheet
                ref={categoriaBottomSheetRef}
                onUpdateCategoria={({ id }) => {
                    setCategoriaId(id);
                    categoriaBottomSheetRef.current?.close();
                }}
            />
        </ThemedView>
    );
};

export default AddDoc;