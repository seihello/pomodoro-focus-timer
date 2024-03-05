import React from "react";
import { TouchableOpacity } from "react-native";
import Text from "./text";

type Props = {
  title: string;
  onPress: () => void;
  type: "primary" | "error";
  className?: string;
};

export default function Button({
  title,
  onPress,
  type,
  className,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={"flex w-full items-center justify-center rounded-lg bg-white py-2".concat(
        " ",
        className || "",
      )}
      activeOpacity={0.9}
      {...rest}
    >
      <Text
        className={`flex w-auto flex-row items-center justify-center font-dm-bold text-2xl ${
          type === "primary"
            ? "text-primary-900"
            : type === "error"
              ? "text-error-900"
              : ""
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
