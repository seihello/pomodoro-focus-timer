import React from "react";
import { TextInput, View } from "react-native";
import PomodoroStatus from "../../enum/pomodoro-status.enum";
import Text from "../ui/text";

type Props = {
  label: string;
  value: number | "";
  setValue: (value: number | "") => void;
  pomodoroStatus: PomodoroStatus;
};

export default function SettingInput({
  label,
  value,
  setValue,
  pomodoroStatus,
}: Props) {
  return (
    <View className="mb-4 flex flex-row items-center justify-between gap-x-4">
      <Text className="font-dm-bold text-lg text-gray-800">{label}</Text>
      <TextInput
        className={`flex w-16 flex-row items-center justify-center rounded-lg border-2 bg-gray-100 pb-2 pt-1 text-center font-dm-bold text-lg text-gray-800 ${pomodoroStatus === PomodoroStatus.Break ? "border-primary-900" : "border-error-500"}`}
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
