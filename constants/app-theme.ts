import {
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  useTheme,
} from "react-native-paper";

export type AppTheme = MD3Theme & {
  custom: {
    spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
    container: { maxWidth: number };
    cardBg: string;
  };
};

export const lightTheme: AppTheme = {
  ...MD3LightTheme,
  roundness: 10,
  colors: {
    ...MD3LightTheme.colors,
    // neutrala ytor (60)
    background: "#FFFFFF",
    surface: "#F6F7FB",
    surfaceVariant: "#E8ECF3",
    onBackground: "#0F172A",
    onSurface: "#0F172A",
    outline: "#C7CED9",

    // sekundära (30)
    secondary: "#476486",
    onSecondary: "#FFFFFF",
    tertiary: "#7EA6D6",
    onTertiary: "#0B1324",

    // primär accent (10) – blå
    primary: "#0A84FF",
    onPrimary: "#FFFFFF",

    // status
    error: "#D92D20",
    onError: "#FFFFFF",
  },
  custom: {
    spacing: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 },
    container: { maxWidth: 520 },
    cardBg: "#FFFFFF",
  },
};
export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 10,
  colors: {
    ...MD3DarkTheme.colors,
    // neutrala ytor (60)
    background: "#0B0D12",
    surface: "#12151C",
    surfaceVariant: "#1A1F29",
    onBackground: "#E5EAF3",
    onSurface: "#E5EAF3",
    outline: "#323949",

    // primär accent (10)
    primary: "#3391FF",
    onPrimary: "#0df705ff",

    // sekundära (30)
    secondary: "#6B8FBF",
    onSecondary: "#0B0D12",
    tertiary: "#93B6E8",
    onTertiary: "#0B0D12",

    // status
    error: "#FF6B6B",
    onError: "#0B0D12",
  },
  custom: {
    spacing: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 },
    container: { maxWidth: 520 },
    cardBg: "#151924",
  },
};

export const useAppTheme = () => useTheme<AppTheme>();
