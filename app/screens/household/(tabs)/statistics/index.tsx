import PieChartHouseHold from "@/components/statistics/piechart";
import { useAppTheme } from "@/constants/app-theme";
import {
  getStatisticsData,
  SelectPeriod,
} from "@/src/services/statisticsService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const gap = 12;
const { width } = Dimensions.get("window");

export default function Statistics() {
  const theme = useAppTheme();
  const defaultPeriod: SelectPeriod = { chosenPeriod: "Denna veckan" };
  const [selectPeriod, setSelectPeriod] = useState<SelectPeriod>(defaultPeriod);

  const query = useQuery({
    queryKey: ["statistics", selectPeriod],
    queryFn: () => getStatisticsData(selectPeriod),
  });
  const [numOfColumns, setNumOfColumns] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cardWidth, setCardWidth] = useState<number>(0);

  const showLeft = selectPeriod.chosenPeriod !== "Föregående månad";
  const showRight = selectPeriod.chosenPeriod !== "Denna veckan";

  useEffect(() => {
    if (isLoading && query.isSuccess) {
      const columns = query.data.chorePies.length % 2 === 0 ? 2 : 3;
      setNumOfColumns(columns);
      const cardWidth = Math.floor((width - gap * (columns + 1)) / columns);
      setCardWidth(cardWidth);
      setIsLoading(false);
    }
  }, [isLoading, query.isSuccess, query.data]);

  function handleLeftArrow() {
    if (selectPeriod.chosenPeriod === "Denna veckan") {
      setSelectPeriod({ chosenPeriod: "Föregående veckan" });
      return;
    }
    if (selectPeriod.chosenPeriod === "Föregående veckan") {
      setSelectPeriod({ chosenPeriod: "Föregående månad" });
      return;
    }
  }

  function handlerightArrow() {
    if (selectPeriod.chosenPeriod === "Föregående månad") {
      setSelectPeriod({ chosenPeriod: "Föregående veckan" });
      return;
    }
    if (selectPeriod.chosenPeriod === "Föregående veckan") {
      setSelectPeriod({ chosenPeriod: "Denna veckan" });
      return;
    }
  }

  if (query.isLoading || numOfColumns === 0 || isLoading || cardWidth === 0) {
    return (
      <View
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator animating={true} size={"large"} />
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
          {showLeft ? (
            <TouchableOpacity onPress={handleLeftArrow}>
              <MaterialCommunityIcons
                style={{ color: theme.colors.onSurface }}
                name="arrow-left"
                size={24}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ paddingRight: 22 }}></View>
          )}
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onBackground }}
          >
            {selectPeriod.chosenPeriod}
          </Text>

          {showRight ? (
            <TouchableOpacity onPress={handlerightArrow}>
              <MaterialCommunityIcons
                style={{ color: theme.colors.onSurface }}
                name="arrow-right"
                size={24}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ paddingLeft: 22 }}></View>
          )}
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
            columnWrapperStyle={{ gap: 12 }}
            showsVerticalScrollIndicator={false}
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
