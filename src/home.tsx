import { Audio } from "expo-av";
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
  // User setting values
  const [focusMinutes, setFocusMinutes] = useState<number>(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState<number>(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState<number>(15);

  // User setting values
  const [usedFocusMinutes, setUsedFocusMinutes] = useState<number>(25);
  const [usedShortBreakMinutes, setUsedShortBreakMinutes] = useState<number>(5);
  const [usedLongBreakMinutes, setUsedLongBreakMinutes] = useState<number>(15);

  const [pomodoroStatus, setPomodoroStatus] = useState(PomodoroStatus.None);
  const [lapStartTime, setLapStartTime] = useState<Date>(new Date());
  const [pausedTime, setPausedTime] = useState<Date | null>(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pausedMillSeconds, setPausedMillSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSessionCount, setCompletedSessionCount] = useState(0);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const [breakStartSound, setBreakStartSound] = useState<Audio.Sound>();
  const [focusStartSound, setFocusStartSound] = useState<Audio.Sound>();

  const onStartButtonPressed = () => {
    setLapStartTime(new Date());
    setPomodoroStatus(PomodoroStatus.Focus);

    setUsedFocusMinutes(focusMinutes);
    setUsedShortBreakMinutes(shortBreakMinutes);
    setUsedLongBreakMinutes(longBreakMinutes);
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
    setCompletedSessionCount(0);
    setPomodoroStatus(PomodoroStatus.None);
  };

  const onSettingIconPressed = () => {
    setIsSettingOpen(!isSettingOpen);
  };

  useEffect(() => {
    const monitor = setInterval(async () => {
      if (pomodoroStatus === PomodoroStatus.None || isPaused) return;
      const elapsedMilliSeconds =
        new Date().getTime() - lapStartTime.getTime() - pausedMillSeconds;

      const elapsedSeconds = Math.floor(elapsedMilliSeconds / 1000);

      if (
        pomodoroStatus === PomodoroStatus.Focus &&
        elapsedSeconds >= usedFocusMinutes * 60
      ) {
        setElapsedSeconds(0);
        setPausedMillSeconds(0);
        setLapStartTime(new Date());
        setPomodoroStatus(PomodoroStatus.Break);
        setUsedFocusMinutes(focusMinutes);
        setUsedShortBreakMinutes(shortBreakMinutes);
        setUsedLongBreakMinutes(longBreakMinutes);

        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sound/school_bell.mp3"),
        );
        await sound.playAsync();
      } else if (
        pomodoroStatus === PomodoroStatus.Break &&
        (((completedSessionCount + 1) % 4 === 0 &&
          elapsedSeconds >= usedLongBreakMinutes * 60) ||
          ((completedSessionCount + 1) % 4 !== 0 &&
            elapsedSeconds >= usedShortBreakMinutes * 60))
      ) {
        setElapsedSeconds(0);
        setPausedMillSeconds(0);
        setLapStartTime(new Date());
        setPomodoroStatus(PomodoroStatus.Focus);
        setUsedFocusMinutes(focusMinutes);
        setUsedShortBreakMinutes(shortBreakMinutes);
        setUsedLongBreakMinutes(longBreakMinutes);

        // if (focusStartSound) await focusStartSound.playAsync();
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sound/school_bell.mp3"),
        );
        await sound.playAsync();

        setCompletedSessionCount(completedSessionCount + 1);
      } else {
        setElapsedSeconds(elapsedSeconds);
      }
    }, 50);

    return () => {
      clearInterval(monitor);
    };
  }, [
    pomodoroStatus,
    focusMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    usedFocusMinutes,
    usedShortBreakMinutes,
    usedLongBreakMinutes,
    lapStartTime,
    setElapsedSeconds,
    isPaused,
    pausedTime,
  ]);

  useEffect(() => {
    const loadSound = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

        const { sound: playbackObject } = await Audio.Sound.createAsync(
          require("../assets/sound/school_bell.mp3"),
        );
        setBreakStartSound(playbackObject);
        setFocusStartSound(playbackObject);
      } catch (error) {
        console.error(error);
      }
    };

    loadSound();
  }, []);

  const LAP_MINUTES =
    pomodoroStatus === PomodoroStatus.Focus
      ? usedFocusMinutes
      : (completedSessionCount + 1) % 4 === 0
        ? usedLongBreakMinutes
        : usedShortBreakMinutes;
  const remainingSeconds = LAP_MINUTES * 60 - elapsedSeconds;

  return (
    <View
      className={`relative flex h-screen w-full flex-col px-4 pt-8 ${
        pomodoroStatus === PomodoroStatus.Break
          ? "bg-primary-900"
          : "bg-error-500"
      }`}
    >
      <TouchableOpacity
        onPress={onSettingIconPressed}
        className="absolute right-6 top-16 z-10 flex flex-col items-center"
        activeOpacity={0.9}
      >
        <Icon name="settings-sharp" color="#FFFFFF" size={32} />
        <Text className="mt-1 font-dm-bold text-white">設定</Text>
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
      <Text className="mb-24 mt-32 py-4 text-center font-dm-bold text-3xl text-white">
        {pomodoroStatus === PomodoroStatus.Focus
          ? "作業がんばりましょう"
          : pomodoroStatus === PomodoroStatus.Break
            ? "休憩しましょう"
            : " "}
      </Text>
      <View className="flex flex-row justify-center">
        <Text className="w-36 py-2 text-right font-dm-bold text-8xl tracking-widest text-white">
          {pomodoroStatus === PomodoroStatus.None
            ? ("0" + String(focusMinutes)).slice(-2)
            : ("0" + String(Math.floor(remainingSeconds / 60))).slice(-2)}
        </Text>
        <Text className="w-8 py-2 text-center font-dm-bold text-8xl text-white">
          :
        </Text>
        <Text className="w-36 py-2 text-left font-dm-bold text-8xl tracking-widest text-white">
          {pomodoroStatus === PomodoroStatus.None
            ? "00"
            : ("0" + String(remainingSeconds % 60)).slice(-2)}
        </Text>
      </View>
      {pomodoroStatus === PomodoroStatus.None ? (
        <Button title="開始" onPress={onStartButtonPressed} type="error" />
      ) : isPaused ? (
        <Button
          title="再開"
          onPress={onResumeButtonPressed}
          type={pomodoroStatus === PomodoroStatus.Break ? "primary" : "error"}
        />
      ) : (
        <Button
          title="一時停止"
          onPress={onPauseButtonPressed}
          type={pomodoroStatus === PomodoroStatus.Break ? "primary" : "error"}
        />
      )}
      <Button
        title="最初から"
        onPress={onResetButtonPressed}
        type={pomodoroStatus === PomodoroStatus.Break ? "primary" : "error"}
        className="mt-2"
      />
    </View>
  );
}
