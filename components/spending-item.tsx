import { Text, View } from "react-native";
import { Link } from "expo-router";
import styles from "./styles";
import { currencyFormatter } from "./utils";

class SpendingItemProps {
  link: string = "";
  amount: number = 0;
  description: string = "";
  shared: boolean = false;
}

export default function SpendingItem(props: SpendingItemProps) {
  return (
    <Link
      href={props.link as any}
      style={[
        styles.sectionListItem,
        { backgroundColor: props.shared ? "#FFEB00" : "#D9EAFD" },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.leftListItem}>{props.description}</Text>
        <Text style={styles.rightListItem}>
          {currencyFormatter.format(props.amount)}
        </Text>
      </View>
    </Link>
  );
}
