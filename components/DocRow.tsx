
import { Ionicons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import numeral from 'numeral';
import { TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Documento } from '@/models/Documento';

const SWIPE_THRESHOLD = -128;

export default function DocRow({ item, onDelete, onEdit }: { item: Documento, onDelete: () => void, onEdit: () => void }) {
    const translateX = useSharedValue(0);
    const context = useSharedValue({ x: 0 });

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { x: translateX.value }
        })
        .onUpdate((event) => {
            translateX.value = Math.max(SWIPE_THRESHOLD, Math.min(0, context.value.x + event.translationX));
        })
        .onEnd(() => {
            if (translateX.value < SWIPE_THRESHOLD / 2) {
                translateX.value = withTiming(SWIPE_THRESHOLD);
            } else {
                translateX.value = withTiming(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const closeSwipeable = () => {
        translateX.value = withTiming(0);
    }

    const handleDelete = () => {
        runOnJS(onDelete)();
        closeSwipeable();
    }

    const handleEdit = () => {
        runOnJS(onEdit)();
        closeSwipeable();
    }

    return (
        <View>
            <View style={{ width: Math.abs(SWIPE_THRESHOLD) }} className="absolute top-0 bottom-0 right-0 flex-row">
                <TouchableOpacity
                    className="bg-blue-500 items-center justify-center flex-1"
                    onPress={handleEdit}
                >
                    <Ionicons name="pencil" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-red-500 items-center justify-center flex-1"
                    onPress={handleDelete}
                >
                    <Ionicons name="trash" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={animatedStyle}>
                    <ThemedView className="flex-row p-2 border-b border-gray-200 dark:border-gray-700 items-center gap-2 bg-white dark:bg-black">
                        <ThemedText className="w-1/4 text-center">{DateTime.fromISO(item.fecha).toFormat('dd-MM-yyyy')}</ThemedText>
                        <ThemedText className="flex-1 text-left" numberOfLines={1}>{item.proposito}</ThemedText>
                        <ThemedText className="w-1/4 text-right">{numeral(item.monto).format('$0,0')}</ThemedText>
                    </ThemedView>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};
