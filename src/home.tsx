import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6";
import IonIcon from "react-native-vector-icons/Ionicons";
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
  const [isSoundOn, setIsSoundOn] = useState<boolean>(false);

  // User setting values that are currently used
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

  const transitBackgroundColor = useRef(new Animated.Value(1)).current;

  const updateColor = (status: PomodoroStatus) => {
    if (status === PomodoroStatus.Break) {
      Animated.timing(transitBackgroundColor, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(transitBackgroundColor, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

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

        if (isSoundOn) {
          const { sound } = await Audio.Sound.createAsync(
            require("../assets/sound/school_bell.mp3"),
          );
          await sound.playAsync();
        }
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

        if (isSoundOn) {
          const { sound } = await Audio.Sound.createAsync(
            require("../assets/sound/school_bell.mp3"),
          );
          await sound.playAsync();
        }

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
    isSoundOn,
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

  useEffect(() => {
    updateColor(pomodoroStatus);
  }, [pomodoroStatus]);

  const LAP_MINUTES =
    pomodoroStatus === PomodoroStatus.Focus
      ? usedFocusMinutes
      : (completedSessionCount + 1) % 4 === 0
        ? usedLongBreakMinutes
        : usedShortBreakMinutes;
  const remainingSeconds = LAP_MINUTES * 60 - elapsedSeconds;

  return (
    <Animated.View
      className="relative flex h-screen w-full flex-col px-4 pt-8"
      style={{
        backgroundColor: transitBackgroundColor.interpolate({
          inputRange: [0, 1],
          outputRange: ["rgb(9, 130, 146)", "rgb(245, 92, 103)"],
        }),
      }}
      onTouchEnd={() => {
        setIsSettingOpen(false);
      }}
    >
      <View className="absolute right-4 top-16 flex flex-row">
        <View
          onTouchEnd={(e: any) => {
            e.stopPropagation();
            if (isSettingOpen) {
              setIsSettingOpen(false);
            } else {
              setIsSoundOn(!isSoundOn);
            }
          }}
          className="z-10 flex w-12 flex-col items-start"
        >
          <View className="ml-[2px]">
            <FontAwesomeIcon
              name={isSoundOn ? "volume-high" : "volume-xmark"}
              className="ml-1"
              color="#FFFFFF"
              size={32}
            />
          </View>
          <Text className="mt-1 font-dm-bold text-white">通知音</Text>
        </View>
        <View
          onTouchEnd={(e: any) => {
            e.stopPropagation();
            setIsSettingOpen(!isSettingOpen);
          }}
          className="z-10 flex w-12 flex-col items-center"
        >
          <IonIcon name={"settings-sharp"} color="#FFFFFF" size={32} />
          <Text className="mt-1 font-dm-bold text-white">設定</Text>
        </View>
      </View>
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
    </Animated.View>
  );
}
