import { useAppTheme } from "@/constants/app-theme";
import { PieChartSliceData } from "@/src/services/statisticsService";
import { StyleSheet, useColorScheme } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface Props {
  data: PieChartSliceData[];
  isTotal: boolean;
}

export default function PieChartHouseHold(prop: Props) {
  if (prop.isTotal)
    return (
      <PieChart
        data={prop.data}
        showTextBackground
        showText
        focusOnPress
        radius={100}
      />
    );
  else {
    return <PieChart data={prop.data} focusOnPress radius={30} />;
  }
}
