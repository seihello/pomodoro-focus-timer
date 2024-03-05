import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Button from "./components/ui/button";
import Text from "./components/ui/text";
import PomodoroStatus from "./enum/pomodoro-status.enum";

const FOCUS_MINUTES = 25;
const NORMAL_BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;
const SESSION_NUM = 4;
const ROUND_NUM = 5;

export default function HomePage(props: any) {
  const [pomodoroStatus, setPomodoroStatus] = useState(PomodoroStatus.None);
  // const [initialStartTime, setInitialStartTime] = useState<Date>(new Date());
  const [lapStartTime, setLapStartTime] = useState<Date>(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pausedSeconds, setPausedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onStartButtonPressed = () => {
    setLapStartTime(new Date());
    setPomodoroStatus(PomodoroStatus.Focus);
  };

  // const onPauseButtonPressed = () => {
  //   setLapStartTime(new Date());
  //   // setPomodoroStatus(PomodoroStatus.Focus);
  // };

  useEffect(() => {
    const monitor = setInterval(() => {
      if (pomodoroStatus === PomodoroStatus.None) return;
      const elapsedMilliSeconds = new Date().getTime() - lapStartTime.getTime();

      const elapsedSeconds = Math.floor(elapsedMilliSeconds / 1000);

      if (
        pomodoroStatus === PomodoroStatus.Focus &&
        elapsedSeconds >= FOCUS_MINUTES * 60
      ) {
        setElapsedSeconds(0);
        setLapStartTime(new Date());
        setPomodoroStatus(PomodoroStatus.Break);
      } else if (
        pomodoroStatus === PomodoroStatus.Break &&
        elapsedSeconds >= NORMAL_BREAK_MINUTES * 60
      ) {
        setElapsedSeconds(0);
        setLapStartTime(new Date());
        setPomodoroStatus(PomodoroStatus.Focus);
      } else {
        setElapsedSeconds(elapsedSeconds);
      }
    }, 50);

    return () => {
      clearInterval(monitor);
    };
  }, [lapStartTime, setElapsedSeconds]);

  const LAP_MINUTES =
    pomodoroStatus === PomodoroStatus.Focus
      ? FOCUS_MINUTES
      : NORMAL_BREAK_MINUTES;
  const remainingSeconds = LAP_MINUTES * 60 - elapsedSeconds;

  return (
    <View
      className={`flex h-screen w-full flex-col justify-center px-4 pt-16 ${
        pomodoroStatus === PomodoroStatus.Break
          ? "bg-primary-900"
          : "bg-error-500"
      }`}
    >
      <View className="flex flex-row justify-center">
        <Text className="w-24 py-2 text-right font-dm-bold text-6xl tracking-widest text-white">
          {pomodoroStatus === PomodoroStatus.None
            ? ("0" + String(FOCUS_MINUTES)).slice(-2)
            : ("0" + String(Math.floor(remainingSeconds / 60))).slice(-2)}
        </Text>
        <Text className="w-8 py-2 text-center font-dm-bold text-6xl text-white">
          :
        </Text>
        <Text className="w-24 py-2 text-left font-dm-bold text-6xl tracking-widest text-white">
          {pomodoroStatus === PomodoroStatus.None
            ? "00"
            : ("0" + String(remainingSeconds % 60)).slice(-2)}
        </Text>
      </View>
      <Button
        title={pomodoroStatus === PomodoroStatus.None ? "Start" : "Reset"}
        onPress={onStartButtonPressed}
        type={pomodoroStatus === PomodoroStatus.Break ? "primary" : "error"}
      />
    </View>
  );
}
