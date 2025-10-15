import { useAuthUser } from "@/auth";
import { useAppTheme } from "@/constants/app-theme";
import { auth } from "@/firebase-config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "@firebase/auth";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

export default function HeaderMenu() {
  const theme = useAppTheme();

  const onLogout = async () => {
    await signOut(auth);
  };

  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
          triggerWrapper: { paddingHorizontal: 8, paddingVertical: 4 },
        }}
      >
        <MaterialCommunityIcons
          style={{ color: theme.colors.onSurface }}
          name="dots-vertical"
          size={24}
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            minWidth: 160,
            borderRadius: 8,
            paddingVertical: 4,
            backgroundColor: theme.colors.surfaceVariant,
          },
          optionWrapper: { paddingVertical: 10, paddingHorizontal: 12 },
        }}
      >
        <MenuOption onSelect={onLogout}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              padding: 10,
            }}
          >
            <MaterialCommunityIcons
              color={theme.colors.onSurface}
              name="logout"
              size={20}
            />
            <Text style={{ color: theme.colors.onSurface }}>Logga ut</Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}
