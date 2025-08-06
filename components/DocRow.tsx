
import { Ionicons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import numeral from 'numeral';
import { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Documento } from '@/models/Documento';


export default function DocRow({ item, onDelete, onEdit }: { item: Documento, onDelete: () => void, onEdit: () => void }) {
    const swipeableRef = useRef<Swipeable>(null);

    const renderRightActions = () => {
        return (
            <View style={{ width: 128 }} className="flex-row">
                <TouchableOpacity
                    className="bg-blue-500 items-center justify-center flex-1"
                    onPress={() => {
                        onEdit();
                        swipeableRef.current?.close();
                    }}
                >
                    <Ionicons name="pencil" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-red-500 items-center justify-center flex-1"
                    onPress={() => {
                        onDelete();
                        swipeableRef.current?.close();
                    }}
                >
                    <Ionicons name="trash" size={24} color="white" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ReanimatedSwipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            friction={2}
            rightThreshold={40}
            overshootRight={false}
        >
            <ThemedView className="flex-row p-2 border-b border-gray-200 dark:border-gray-700 items-center gap-2 bg-white dark:bg-black">
                <ThemedText className="w-1/4 text-center">{DateTime.fromISO(item.fecha).toFormat('dd-MM-yyyy')}</ThemedText>
                <ThemedText className="flex-1 text-left" numberOfLines={1}>{item.proposito}</ThemedText>
                <ThemedText className="w-1/4 text-right">{numeral(item.monto).format('$0,0')}</ThemedText>
            </ThemedView>
        </ReanimatedSwipeable>
    );
};
