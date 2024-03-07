import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import PomodoroStatus from "../../enum/pomodoro-status.enum";
import Text from "../ui/text";
import SettingInput from "./setting-input";

type Props = {
  pomodoroStatus: PomodoroStatus;
  focusMinutes: number;
  setFocusMinutes: (value: number) => void;
  shortBreakMinutes: number;
  setShortBreakMinutes: (value: number) => void;
  longBreakMinutes: number;
  setLongBreakMinutes: (value: number) => void;
  setIsOpen: (value: boolean) => void;
};

export default function SettingView({
  pomodoroStatus,
  focusMinutes,
  setFocusMinutes,
  shortBreakMinutes,
  setShortBreakMinutes,
  longBreakMinutes,
  setLongBreakMinutes,
  setIsOpen,
}: Props) {
  const [tempFocusMinutes, setTempFocusMinutes] = useState<number | "">(
    focusMinutes,
  );
  const [tempShortBreakMinutes, setTempShortBreakMinutes] = useState<
    number | ""
  >(shortBreakMinutes);
  const [tempLongBreakMinutes, setTempLongBreakMinutes] = useState<number | "">(
    longBreakMinutes,
  );

  const onSubmitButtonPressed = () => {
    setFocusMinutes(
      tempFocusMinutes === "" || tempFocusMinutes <= 0 ? 25 : tempFocusMinutes,
    );
    setShortBreakMinutes(
      tempShortBreakMinutes === "" || tempShortBreakMinutes <= 0
        ? 5
        : tempShortBreakMinutes,
    );
    setLongBreakMinutes(
      tempLongBreakMinutes === "" || tempLongBreakMinutes <= 0
        ? 15
        : tempLongBreakMinutes,
    );

    setIsOpen(false);
  };

  return (
    <View className="absolute z-10 flex h-screen w-screen flex-row items-center justify-center px-4 pb-24 pt-32">
      <View className="shadow-1 flex w-full flex-col justify-center rounded-xl bg-gray-100 px-4 py-8">
        <SettingInput
          label="作業時間"
          value={tempFocusMinutes}
          setValue={setTempFocusMinutes}
          pomodoroStatus={pomodoroStatus}
        />
        <SettingInput
          label="休憩時間(短)"
          value={tempShortBreakMinutes}
          setValue={setTempShortBreakMinutes}
          pomodoroStatus={pomodoroStatus}
        />
        <SettingInput
          label="休憩時間(長)"
          value={tempLongBreakMinutes}
          setValue={setTempLongBreakMinutes}
          pomodoroStatus={pomodoroStatus}
        />
        <TouchableOpacity
          onPress={onSubmitButtonPressed}
          className={`flex w-full items-center justify-center rounded-lg py-2 ${pomodoroStatus === PomodoroStatus.Break ? "bg-primary-900" : "bg-error-500"}`}
          activeOpacity={0.9}
        >
          <Text className="flex w-auto flex-row items-center justify-center font-dm-bold text-2xl text-white">
            OK
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
