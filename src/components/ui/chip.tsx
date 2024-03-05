import { View } from "react-native";
import Text from "./text";

export default function Chip(props: any) {
  const { children, ...rest } = props;

  return (
    <View
      className="flex items-center justify-center rounded-full bg-primary-100 px-2 py-1 "
      {...rest}
    >
      <Text className="font-dm-bold text-sm text-primary-900">{children}</Text>
    </View>
  );
}
