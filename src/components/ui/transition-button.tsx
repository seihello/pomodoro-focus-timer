import React from "react";
import { Animated, Text, TouchableOpacity } from "react-native";

type Props = {
  children: any;
  onPress: () => void;
  type: "filled" | "stroke";
  color: Animated.Value;
};

export default function TransitionButton({
  children,
  type,
  onPress,
  color,
}: Props) {
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const AnimatedText = Animated.createAnimatedComponent(Text);
  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      className="my-1 flex w-full items-center justify-center rounded-lg bg-white py-2"
      activeOpacity={0.9}
      style={{
        backgroundColor:
          type === "stroke"
            ? "white"
            : color.interpolate({
                inputRange: [0, 1],
                outputRange: ["rgb(9, 130, 146)", "rgb(245, 92, 103)"],
              }),
      }}
    >
      <AnimatedText
        className="flex w-auto flex-row items-center justify-center font-dm-bold text-2xl"
        style={{
          color:
            type === "filled"
              ? "white"
              : color.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["rgb(9, 130, 146)", "rgb(245, 92, 103)"],
                }),
        }}
      >
        {children}
      </AnimatedText>
    </AnimatedTouchableOpacity>
  );
}
