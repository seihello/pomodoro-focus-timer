import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SettingView from "./components/setting/setting-view";
import Button from "./components/ui/button";
import Text from "./components/ui/text";
import PomodoroStatus from "./enum/pomodoro-status.enum";

const LONG_BREAK_MINUTES = 15;
const SESSION_NUM = 4;
const ROUND_NUM = 5;

export default function HomePage(props: any) {
  const [pomodoroStatus, setPomodoroStatus] = useState(PomodoroStatus.None);
  // const [initialStartTime, setInitialStartTime] = useState<Date>(new Date());
  const [lapStartTime, setLapStartTime] = useState<Date>(new Date());
  const [pausedTime, setPausedTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pausedMillSeconds, setPausedMillSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  // User setting values
  const [focusMinutes, setFocusMinutes] = useState<number>(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState<number>(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState<number>(15);

  const onStartButtonPressed = () => {
    setLapStartTime(new Date());
    setPomodoroStatus(PomodoroStatus.Focus);
  };

  const onPauseButtonPressed = () => {
    setIsPaused(true);
    setPausedTime(new Date());
  };

  const onResumeButtonPressed = () => {
    if (pausedTime) {
      setPausedMillSeconds(
        pausedMillSeconds + (new Date().getTime() - pausedTime.getTime()),
      );
    }
    setIsPaused(false);
    setPausedTime(null);
  };

  const onResetButtonPressed = () => {
    setElapsedSeconds(0);
    setPausedMillSeconds(0);
    setLapStartTime(new Date());
    setPausedTime(null);
    setIsPaused(false);
    setPomodoroStatus(PomodoroStatus.None);
  };

  const onSettingIconPressed = () => {
    setIsSettingOpen(true);
  };

  useEffect(() => {
    const monitor = setInterval(() => {
      if (pomodoroStatus === PomodoroStatus.None || isPaused) return;
      const elapsedMilliSeconds =
        new Date().getTime() - lapStartTime.getTime() - pausedMillSeconds;

      const elapsedSeconds = Math.floor(elapsedMilliSeconds / 1000);

      if (
        pomodoroStatus === PomodoroStatus.Focus &&
        elapsedSeconds >= focusMinutes * 60
      ) {
        setElapsedSeconds(0);
        setPausedMillSeconds(0);
        setLapStartTime(new Date());
        setPomodoroStatus(PomodoroStatus.Break);
      } else if (
        pomodoroStatus === PomodoroStatus.Break &&
        elapsedSeconds >= shortBreakMinutes * 60
      ) {
        setElapsedSeconds(0);
        setPausedMillSeconds(0);
        setLapStartTime(new Date());
        setPomodoroStatus(PomodoroStatus.Focus);
      } else {
        setElapsedSeconds(elapsedSeconds);
      }
    }, 50);

    return () => {
      clearInterval(monitor);
    };
  }, [
    lapStartTime,
    setElapsedSeconds,
    isPaused,
    pausedTime,
    pomodoroStatus,
    focusMinutes,
    shortBreakMinutes,
  ]);

  const LAP_MINUTES =
    pomodoroStatus === PomodoroStatus.Focus ? focusMinutes : shortBreakMinutes;
  const remainingSeconds = LAP_MINUTES * 60 - elapsedSeconds;

  return (
    <View
      className={`relative flex h-screen w-full flex-col justify-center px-4 pt-16 ${
        pomodoroStatus === PomodoroStatus.Break
          ? "bg-primary-900"
          : "bg-error-500"
      }`}
    >
      <TouchableOpacity
        onPress={onSettingIconPressed}
        className="absolute right-6 top-16"
        activeOpacity={0.9}
      >
        <Icon name="settings-sharp" color="#FFFFFF" size={32} />
      </TouchableOpacity>
      {isSettingOpen && (
        <SettingView
          pomodoroStatus={pomodoroStatus}
          focusMinutes={focusMinutes}
          setFocusMinutes={setFocusMinutes}
          shortBreakMinutes={shortBreakMinutes}
          setShortBreakMinutes={setShortBreakMinutes}
          longBreakMinutes={longBreakMinutes}
          setLongBreakMinutes={setLongBreakMinutes}
          setIsOpen={setIsSettingOpen}
        />
      )}
      <View className="flex flex-row justify-center">
        <Text className="w-24 py-2 text-right font-dm-bold text-6xl tracking-widest text-white">
          {pomodoroStatus === PomodoroStatus.None
            ? ("0" + String(focusMinutes)).slice(-2)
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
      {pomodoroStatus === PomodoroStatus.None ? (
        <Button title="Start" onPress={onStartButtonPressed} type="error" />
      ) : isPaused ? (
        <Button
          title="Resume"
          onPress={onResumeButtonPressed}
          type={pomodoroStatus === PomodoroStatus.Break ? "primary" : "error"}
        />
      ) : (
        <Button
          title="Pause"
          onPress={onPauseButtonPressed}
          type={pomodoroStatus === PomodoroStatus.Break ? "primary" : "error"}
        />
      )}
      <Button
        title="Reset"
        onPress={onResetButtonPressed}
        type={pomodoroStatus === PomodoroStatus.Break ? "primary" : "error"}
        className="mt-2"
      />
    </View>
  );
}
