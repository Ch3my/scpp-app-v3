
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Stack } from "expo-router";
import { DateTime } from "luxon";
import { useCallback, useContext, useState } from 'react';
import {
    FlatList,
    ScrollView,
    View
} from 'react-native';
import MaskInput, { createNumberMask } from 'react-native-mask-input';
import {
    Dialog,
    IconButton,
    List,
    Portal,
    Snackbar,
    TextInput,
    useTheme
} from 'react-native-paper';
import { GetAppStyles } from "../../styles/styles";
import { ScppContext } from "../ScppContext";

export default () => {
    const theme = useTheme();
    const appStyles = GetAppStyles(theme)
    const { sessionHash, apiPrefix, setRefetchdocs, tipoDocumentos, categorias } = useContext(ScppContext);

    const [showDocDatePicker, setShowDocDatePicker] = useState<boolean>(false)
    const [showCategoriaInput, setShowCategoriaInput] = useState<boolean>(true)
    const [showCategoriaList, setShowCategoriaList] = useState<boolean>(false)
    const [showTipoDocList, setShowTipoDocList] = useState<boolean>(false)
    const [apiCalling, setApiCalling] = useState<boolean>(false)

    const [showSnackBar, setShowSnackBar] = useState<boolean>(false)
    const [snackbarMsg, setSnackbarMsg] = useState<string>("")
    const [negativeMonto, setNegativeMonto] = useState<boolean>(false)

    let [docDate, setDocDate] = useState<Date>(new Date())
    let [docCatId, setDocCatId] = useState<number | null>(1)
    let [docCatName, setDocCatName] = useState<string>("")
    let [docTipoDocId, setDocTipoDocId] = useState<number>(1)
    let [docTipoDocName, setDocTipoDocName] = useState<string>("Gasto")
    let [docProposito, setDocProposito] = useState<string>("")
    let [docMonto, setDocMonto] = useState<number>(0)

    const onChangeDocDatePicker = useCallback((event: any, selectedDate?: Date) => {
        setShowDocDatePicker(false)
        if (selectedDate) {
            setDocDate(selectedDate)
        }
    }, [])
    const onUpdateCategoria = useCallback(({ id, descripcion }: { id: number | null, descripcion: string }) => {
        setDocCatId(id)
        setDocCatName(descripcion)
        setShowCategoriaList(false)
    }, [])
    const onUpdateTipoDoc = useCallback(({ id, descripcion }: { id: number, descripcion: string }) => {
        setDocTipoDocId(id)
        setDocTipoDocName(descripcion)
        setShowTipoDocList(false)
        if (id != 1) {
            setShowCategoriaInput(false)
        }
        if (id == 1) {
            setShowCategoriaInput(true)
        }
    }, [])
    const saveDoc = async () => {
        setApiCalling(true)
        setShowSnackBar(false)
        if (docTipoDocId == 1 && docCatId == 0) {
            setSnackbarMsg("Selecciona la categoria")
            setShowSnackBar(true)
            setApiCalling(false)
            return
        }
        if (docProposito == "") {
            setSnackbarMsg("Ingresa Proposito")
            setShowSnackBar(true)
            setApiCalling(false)
            return
        }
        if (docTipoDocId == 1 && docMonto == 0) {
            setSnackbarMsg("Ingresa el Monto")
            setShowSnackBar(true)
            setApiCalling(false)
            return
        }

        let computedMonto = docMonto
        if (negativeMonto) {
            computedMonto *= -1
        }

        let apiArgs: {
            fk_categoria: number | null;
            proposito: string;
            fecha: string;
            monto: number;
            fk_tipoDoc: number;
            sessionHash: string;
        } = {
            fk_categoria: null,
            proposito: docProposito,
            fecha: DateTime.fromJSDate(docDate).toFormat('yyyy-MM-dd'),
            monto: computedMonto,
            fk_tipoDoc: docTipoDocId,
            sessionHash,
        }
        if (docTipoDocId == 1) {
            apiArgs.fk_categoria = docCatId
        }
        let response = await axios.post(apiPrefix + '/documentos', apiArgs)
        if (response.data.hasErrors) {
            setSnackbarMsg("Error al guardar documento")
            setShowSnackBar(true)
            setApiCalling(false)
            return
        }
        setSnackbarMsg("Documento guardado con Exito")
        setShowSnackBar(true)
        setRefetchdocs(true)
        setApiCalling(false)
    }

    const dollarMask = createNumberMask({
        prefix: ['$', ' '],
        delimiter: '.',
        separator: ',',
        precision: 0,
    })

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ headerTitle: "Agregar Documento" }} />
            <Portal>
                <Snackbar
                    duration={2500}
                    visible={showSnackBar}
                    style={{ zIndex: 999 }}
                    onDismiss={() => { setShowSnackBar(false) }}>
                    {snackbarMsg}
                </Snackbar>
            </Portal>
            <Portal>
                <Dialog visible={showCategoriaList} onDismiss={() => { setShowCategoriaList(false) }} style={{ height: '80%' }}>
                    <Dialog.Title>Categoria</Dialog.Title>
                    <Dialog.ScrollArea>
                        <FlatList
                            data={categorias}
                            renderItem={({ item }) =>
                                <List.Item
                                    title={item.descripcion}
                                    key={item.id}
                                    onPress={() => { onUpdateCategoria({ id: item.id, descripcion: item.descripcion }) }} />
                            } />
                    </Dialog.ScrollArea>
                </Dialog>
                <Dialog visible={showTipoDocList} onDismiss={() => { setShowTipoDocList(false) }}>
                    <Dialog.Title>Tipo Documento</Dialog.Title>
                    <Dialog.ScrollArea>
                        <FlatList
                            data={tipoDocumentos}
                            renderItem={({ item }) =>
                                <List.Item
                                    title={item.descripcion}
                                    key={item.id}
                                    onPress={() => { onUpdateTipoDoc({ id: item.id, descripcion: item.descripcion }) }} />
                            } />
                    </Dialog.ScrollArea>
                </Dialog>
            </Portal>
            <View style={appStyles.btnRow}>
                <IconButton
                    style={appStyles.btnRowBtn}
                    icon="content-save"
                    mode="contained-tonal"
                    containerColor={theme.colors.primary}
                    iconColor={theme.colors.onPrimary}
                    size={30}
                    onPress={saveDoc}
                    disabled={apiCalling}
                />
            </View>
            <View style={appStyles.container}>
                <ScrollView>
                    <TextInput mode="flat" label='Monto'
                        inputMode='numeric'
                        value={docMonto.toString()}
                        dense={true}
                        style={{ marginBottom: 5 }}
                        right={<TextInput.Icon icon="minus-circle" onPress={() => { setNegativeMonto(!negativeMonto) }}
                            color={() => negativeMonto ? "red" : theme.colors.onSurfaceVariant} />}
                        render={props =>
                            <MaskInput
                                {...props}
                                onChangeText={(masked, unmasked) => {
                                    setDocMonto(parseInt(unmasked))
                                }}
                                mask={dollarMask}
                            />
                        } />
                    <TextInput label='Proposito'
                        style={{ marginBottom: 5 }}
                        mode="flat"
                        dense={true}
                        value={docProposito}
                        autoCapitalize="none"
                        onChangeText={text => setDocProposito(text)} />
                    <TextInput
                        style={{ marginBottom: 5 }}
                        label="Fecha"
                        mode="flat"
                        dense={true}
                        editable={false}
                        value={DateTime.fromJSDate(docDate).toFormat('yyyy-MM-dd')}
                        right={<TextInput.Icon icon="calendar" onPress={() => { setShowDocDatePicker(true) }} />}
                    />
                    {showDocDatePicker && (
                        <DateTimePicker testID="dateTimePicker" value={docDate} mode="date"
                            display="default" onChange={onChangeDocDatePicker}
                        />
                    )}
                    <TextInput
                        style={{ marginBottom: 5 }}
                        label="Tipo Doc"
                        mode="flat"
                        dense={true}
                        editable={false}
                        value={docTipoDocName}
                        right={<TextInput.Icon icon="chevron-down" onPress={() => { setShowTipoDocList(true) }} />}
                    />
                    {showCategoriaInput &&
                        <TextInput
                            style={{ marginBottom: 5 }}
                            label="Categoria"
                            mode="flat"
                            dense={true}
                            editable={false}
                            value={docCatName}
                            right={<TextInput.Icon icon="chevron-down" onPress={() => { setShowCategoriaList(true) }} />}
                        />
                    }
                </ScrollView>
            </View>
        </View>
    )
}