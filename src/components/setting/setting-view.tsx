import React, { useState } from "react";
import { Animated, View } from "react-native";
import TransitionButton from "../ui/transition-button";
import SettingInput from "./setting-input";

type Props = {
  focusMinutes: number;
  setFocusMinutes: (value: number) => void;
  shortBreakMinutes: number;
  setShortBreakMinutes: (value: number) => void;
  longBreakMinutes: number;
  setLongBreakMinutes: (value: number) => void;
  setIsOpen: (value: boolean) => void;
  transitThemeColor: Animated.Value;
};

export default function SettingView({
  focusMinutes,
  setFocusMinutes,
  shortBreakMinutes,
  setShortBreakMinutes,
  longBreakMinutes,
  setLongBreakMinutes,
  setIsOpen,
  transitThemeColor,
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

  const [rootWidth, setRootWidth] = useState(0);
  const [rootHeight, setRootHeight] = useState(0);

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
    <View
      className="shadow-1 absolute left-1/2 top-1/2 z-20 ml-4 mt-4 flex w-full flex-col justify-center rounded-xl bg-gray-100 px-4 py-8"
      style={{
        transform: [
          { translateX: -rootWidth / 2 },
          { translateY: -rootHeight / 2 },
        ],
        opacity: rootWidth && rootHeight ? 1 : 0,
      }}
      onLayout={(event) => {
        setRootWidth(event.nativeEvent.layout.width);
        setRootHeight(event.nativeEvent.layout.height);
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
    >
      <SettingInput
        label="作業時間"
        value={tempFocusMinutes}
        setValue={setTempFocusMinutes}
        transitThemeColor={transitThemeColor}
      />
      <SettingInput
        label="休憩時間(短)"
        value={tempShortBreakMinutes}
        setValue={setTempShortBreakMinutes}
        transitThemeColor={transitThemeColor}
      />
      <SettingInput
        label="休憩時間(長)"
        value={tempLongBreakMinutes}
        setValue={setTempLongBreakMinutes}
        transitThemeColor={transitThemeColor}
      />
      <TransitionButton
        type="filled"
        onPress={onSubmitButtonPressed}
        color={transitThemeColor}
      >
        変更
      </TransitionButton>
    </View>
  );
}
