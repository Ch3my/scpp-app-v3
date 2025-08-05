import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  className = '',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const typeClasses = {
    default: 'text-base',
    title: 'text-3xl font-bold',
    defaultSemiBold: 'text-base font-semibold',
    subtitle: 'text-xl font-bold',
    link: 'text-base text-blue-500 underline',
  };

  return (
    <Text
      className={`${typeClasses[type]} ${className}`}
      style={[{ color }, style]}
      {...rest}
    />
  );
}

