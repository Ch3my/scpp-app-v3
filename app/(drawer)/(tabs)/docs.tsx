import DocRow from "@/components/DocRow";
import ListDocsFilters from "@/components/ListDocsFilters";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Documento } from "@/models/Documento";
import useStore from "@/store/useStore";
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Stack, router } from "expo-router";
import { DateTime } from "luxon";
import numeral from "numeral";
import { useCallback, useState } from "react";
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from "react-native";

const fetchDocuments = async ({ queryKey }: any) => {
    const [_key, { fechaInicio, fechaTermino, tipoDocFilterId, categoriaFilterId, searchPhrase, searchPhraseIgnoreOtherFilters, sessionHash, apiUrl }] = queryKey;
    const { data } = await axios.get(`${apiUrl}/documentos`, {
        params: {
            fechaInicio: fechaInicio?.toFormat('yyyy-MM-dd'),
            fechaTermino: fechaTermino?.toFormat('yyyy-MM-dd'),
            fk_tipoDoc: tipoDocFilterId,
            fk_categoria: categoriaFilterId,
            searchPhrase,
            searchPhraseIgnoreOtherFilters,
            sessionHash,
        },
    });
    return data;
};

const deleteDocument = async ({ id, sessionHash, apiUrl }: { id: number, sessionHash: string, apiUrl: string }) => {
    await axios.delete(`${apiUrl}/documentos`, { data: { id, sessionHash } });
};

const DocHeader = () => (
    <View className="flex-row bg-gray-200 p-2 dark:bg-gray-800">
        <ThemedText className="w-1/4 text-center font-bold">Fecha</ThemedText>
        <ThemedText className="w-1/2 text-center font-bold">Propósito</ThemedText>
        <ThemedText className="w-1/4 text-center font-bold">Monto</ThemedText>
    </View>
);




export default function DocsScreen() {
    const queryClient = useQueryClient();

    const { sessionHash, apiUrl, tipoDocumentos } = useStore();

    const [fechaInicio, setFechaInicio] = useState<DateTime | null>(DateTime.local().startOf("month"));
    const [fechaTermino, setFechaTermino] = useState<DateTime | null>(DateTime.local().endOf("month"));
    const [tipoDocFilterId, setTipoDocFilterId] = useState<number>(1);
    const [categoriaFilterId, setCategoriaFilterId] = useState<number | null>(null);
    const [searchPhrase, setSearchPhrase] = useState<string | undefined>(undefined);
    const [searchPhraseIgnoreOtherFilters, setSearchPhraseIgnoreOtherFilters] = useState(true);
    const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
    const [showTipoDocFilter, setShowTipoDocFilter] = useState<boolean>(false);

    const { data: docsList = [], isFetching, refetch } = useQuery<Documento[]>({
        queryKey: ['documents', { fechaInicio, fechaTermino, tipoDocFilterId, categoriaFilterId, searchPhrase, searchPhraseIgnoreOtherFilters, sessionHash, apiUrl }],
        queryFn: fetchDocuments,
        enabled: !!sessionHash,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });

    const handleDelete = (id: number) => {
        if (sessionHash && apiUrl) {
            deleteMutation.mutate({ id, sessionHash, apiUrl });
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/docs/edit/${id}`);
    };


    const sumaTotalDocs = docsList.reduce((acc: number, doc: Documento) => acc + doc.monto, 0);

    const onUpdateTipoDoc = ({ id }: { id: number }) => {
        const currentDate = DateTime.local();
        let newFecIni = currentDate.startOf('year');
        let newFecTer = currentDate.endOf('year');
        if (id === 1) { // Gastos
            newFecIni = currentDate.startOf('month');
            newFecTer = currentDate.endOf('month');
        }
        setFechaInicio(newFecIni);
        setFechaTermino(newFecTer);
        setTipoDocFilterId(id);
        setShowTipoDocFilter(false);
    };

    const handleFilterUpdate = (filters: {
        searchPhrase: string | undefined;
        categoriaFilterId: number | null;
        fechaInicio: DateTime | null;
        fechaTermino: DateTime | null;
        searchPhraseIgnoreOtherFilters: boolean;
    }) => {
        setSearchPhrase(filters.searchPhrase);
        setCategoriaFilterId(filters.categoriaFilterId);
        setFechaInicio(filters.fechaInicio);
        setFechaTermino(filters.fechaTermino);
        setSearchPhraseIgnoreOtherFilters(filters.searchPhraseIgnoreOtherFilters);
    };

    const renderItem = useCallback(
        ({ item }: { item: Documento }) => <DocRow item={item} onDelete={() => handleDelete(item.id)} onEdit={() => handleEdit(item.id)} />,
        [] // Dependencies are stable
    );

    const tipoDocFilterName = tipoDocumentos.find(td => td.id === tipoDocFilterId)?.proposito || 'Tipo Doc';

    return (
        <ThemedView className="flex-1">
            <Stack.Screen options={{
                headerTitle: "Documentos",
                headerRight: () => (
                    <TouchableOpacity onPress={() => router.push('/(drawer)/food')} className="mr-4">
                        <Ionicons name="fast-food-outline" size={24} color={Colors.light.tint} />
                    </TouchableOpacity>
                )
            }} />

            <Modal
                visible={showTipoDocFilter}
                onRequestClose={() => setShowTipoDocFilter(false)}
                transparent={true}
                animationType="fade"
            >
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowTipoDocFilter(false)} className="bg-black/50" />
                <View className="flex-1 justify-center items-center p-8">
                    <ThemedView className="p-5 rounded-lg w-full">
                        <FlatList
                            data={tipoDocumentos}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="p-3"
                                    onPress={() => onUpdateTipoDoc({ id: item.id })}
                                >
                                    <ThemedText className="text-lg">{item.proposito}</ThemedText>
                                </TouchableOpacity>
                            )}
                        />
                    </ThemedView>
                </View>
            </Modal>

            {/* Toolbar */}
            <View className="flex-row justify-between items-center p-2 bg-gray-100 dark:bg-gray-900">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.push('/docs/add-doc')} className="p-2 bg-blue-500 rounded-full">
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowFiltersModal(true)} className="p-2 ml-2 bg-gray-300 dark:bg-gray-700 rounded-full">
                        <Ionicons name="filter" size={20} color={Colors.light.text} />
                    </TouchableOpacity>
                </View>
                <ThemedText className="text-lg font-bold">${numeral(sumaTotalDocs).format('0,0')}</ThemedText>
                <TouchableOpacity onPress={() => setShowTipoDocFilter(true)} className="p-2 bg-gray-300 dark:bg-gray-700 rounded-lg">
                    <ThemedText>{tipoDocFilterName}</ThemedText>
                </TouchableOpacity>
            </View>

            {/* Document List */}
            <FlatList
                data={docsList}
                onRefresh={refetch}
                refreshing={isFetching}
                ListHeaderComponent={<DocHeader />}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<ThemedText className="text-center mt-5">No hay documentos</ThemedText>}
                initialNumToRender={15}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            <ListDocsFilters
                visible={showFiltersModal}
                onDismiss={() => setShowFiltersModal(false)}
                onFilterUpdate={handleFilterUpdate}
                initialSearchPhrase={searchPhrase}
                initialCategoriaFilterId={categoriaFilterId}
                initialFechaInicio={fechaInicio}
                initialFechaTermino={fechaTermino}
            />
        </ThemedView>
    );
}