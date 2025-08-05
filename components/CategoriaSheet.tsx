
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import useStore from '@/store/useStore';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface CategoriaSheetProps {
    onUpdateCategoria: (args: { id: number }) => void;
}

const CategoriaSheet = forwardRef<BottomSheet, CategoriaSheetProps>(({ onUpdateCategoria }, ref) => {
    const colorScheme = useColorScheme();
    const { categorias } = useStore();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const snapPoints = ['25%', '50%'];

    const renderBackdrop = (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />;

    const renderHeader = () => (
        <View className="p-5">
            <ThemedText type="title">Categoría</ThemedText>
        </View>
    );

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
            <BottomSheetFlatList
                data={categorias}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="p-3 mx-5"
                        onPress={() => onUpdateCategoria({ id: item.id })}
                    >
                        <ThemedText className="text-lg">{item.descripcion}</ThemedText>
                    </TouchableOpacity>
                )}
            />
        </BottomSheet>
    );
});

export default CategoriaSheet;
