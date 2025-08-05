import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import useStore from '@/store/useStore';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';

interface TipoDocSheetProps {
    onUpdateTipoDoc: (args: { id: number }) => void;
}

const TipoDocSheet = forwardRef<BottomSheet, TipoDocSheetProps>(({ onUpdateTipoDoc }, ref) => {
    const colorScheme = useColorScheme();
    const { tipoDocumentos } = useStore();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const snapPoints = ['25%', '50%'];

    const renderBackdrop = (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />;

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: themeColors.background }}
            handleIndicatorStyle={{ backgroundColor: themeColors.text }}
        >
            <BottomSheetView style={{ flex: 1, backgroundColor: themeColors.background }} className="p-5">
                <Text style={{ color: themeColors.text, fontSize: 32, fontWeight: 'bold', marginBottom: 20 }}>Tipo de Documento</Text>
                <FlatList
                    data={tipoDocumentos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="border-t border-gray-200 dark:border-gray-700 p-4"
                            onPress={() => onUpdateTipoDoc({ id: item.id })}
                        >
                            <Text style={{ color: themeColors.text, fontSize: 18 }}>{item.descripcion}</Text>
                        </TouchableOpacity>
                    )}
                />
            </BottomSheetView>
        </BottomSheet>
    );
});

export default TipoDocSheet;