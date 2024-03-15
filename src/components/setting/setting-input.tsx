import React from "react";
import { Animated, TextInput, View } from "react-native";
import Text from "../ui/text";

type Props = {
  label: string;
  value: number | "";
  setValue: (value: number | "") => void;
  transitThemeColor: Animated.Value;
};

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function SettingInput({
  label,
  value,
  setValue,
  transitThemeColor,
}: Props) {
  return (
    <View className="mb-4 flex flex-row items-center justify-between gap-x-4">
      <Text className="font-dm-bold text-lg text-gray-800">{label}</Text>
      <AnimatedTextInput
        className="flex w-16 flex-row items-center justify-center rounded-lg border-2 bg-gray-100 pb-2 pt-1 text-center font-dm-bold text-lg text-gray-800"
        style={{
          borderColor: transitThemeColor.interpolate({
            inputRange: [0, 1],
            outputRange: ["rgb(9, 130, 146)", "rgb(245, 92, 103)"],
          }),
        }}
        keyboardType="numeric"
        onChangeText={(value) => {
          if (value.length === 0) {
            setValue("");
          } else if (!Number.isNaN(Number(value))) {
            setValue(Number(value));
          }
        }}
        value={String(value)}
        maxLength={3}
        textAlignVertical="center"
      />
    </View>
  );
}
