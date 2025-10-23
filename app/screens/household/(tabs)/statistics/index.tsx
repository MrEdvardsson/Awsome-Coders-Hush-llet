import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Text, Card, ActivityIndicator } from "react-native-paper";
import { useAppTheme } from "@/constants/app-theme";
import { SafeAreaView } from "react-native-safe-area-context";
import PieChartHouseHold from "@/components/statistics/piechart";
import { useQuery } from "@tanstack/react-query";
import { getStatisticsData } from "@/src/services/statisticsService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

const numOfColumns = 2;
const gap = 12;
const { width } = Dimensions.get("window");

export default function Statistics() {
  const theme = useAppTheme();
  const query = useQuery({ queryKey: ["chores"], queryFn: getStatisticsData });
  const [numOfColumns, setNumOfColumns] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cardWidth, setCardWidth] = useState<number>(0);

  // useEffect(() => {
  //   setIsLoading(true);
  // }, []);

  useEffect(() => {
    if (isLoading && query.isSuccess) {
      const columns = query.data.chorePies.length % 2 === 0 ? 2 : 3;
      setNumOfColumns(columns);
      const cardWidth = Math.floor((width - gap * (columns + 1)) / columns);
      setCardWidth(cardWidth);
      setIsLoading(false);
    }
  }, [isLoading, query.isSuccess]);

  if (query.isLoading || numOfColumns === 0 || isLoading || cardWidth === 0) {
    return (
      <View
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  if (query.isSuccess) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
            paddingTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => alert("Implementation kommer snart")}
          >
            <MaterialCommunityIcons
              style={{ color: theme.colors.onSurface }}
              name="arrow-left"
              size={24}
            />
          </TouchableOpacity>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onBackground }}
          >
            Denna veckan
          </Text>
          <TouchableOpacity
            onPress={() => alert("Implementation kommer snart")}
          >
            <MaterialCommunityIcons
              style={{ color: theme.colors.onSurface }}
              name="arrow-right"
              size={24}
            />
          </TouchableOpacity>
        </View>
        <View style={{ alignSelf: "center" }}>
          <FlatList
            data={query.data.chorePies}
            keyExtractor={(x) => x.choreId}
            numColumns={numOfColumns}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Card
                  mode="elevated"
                  style={[
                    styles.totalCard,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <Card.Content style={styles.totalContent}>
                    <PieChartHouseHold
                      data={query.data.totalPie}
                      isTotal={true}
                    />

                    <Text variant="titleMedium" style={styles.totalLabel}>
                      Totalt
                    </Text>
                  </Card.Content>
                </Card>
              </View>
            }
            renderItem={({ item }) => (
              <Card
                mode="elevated"
                style={[
                  styles.choreCard,
                  { width: cardWidth, backgroundColor: theme.colors.surface },
                ]}
              >
                <Card.Content style={styles.choreContent}>
                  <PieChartHouseHold data={item.sliceData} isTotal={false} />
                  <Text
                    variant="titleSmall"
                    numberOfLines={2}
                    style={styles.choreTitle}
                  >
                    {item.choreTitle}
                  </Text>
                </Card.Content>
              </Card>
            )}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: -20,
  },
  listHeader: {
    marginBottom: 4,
  },
  totalCard: {
    borderRadius: 16,
    paddingTop: 10,
    marginBottom: 10,
  },
  totalContent: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  },
  totalLabel: {
    marginTop: 8,
  },
  choreCard: {
    borderRadius: 16,
    marginBottom: 10,
  },
  choreContent: {
    alignItems: "center",
    paddingVertical: 12,
  },
  choreTitle: {
    textAlign: "center",
    marginTop: 8,
  },
});
