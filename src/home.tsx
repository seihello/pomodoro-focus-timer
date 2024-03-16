import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6";
import IonIcon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SettingView from "./components/setting/setting-view";
import Text from "./components/ui/text";
import TransitionButton from "./components/ui/transition-button";
import PomodoroStatus from "./enum/pomodoro-status.enum";
import loadSettings from "./lib/settings/load-settings";
import saveSettings from "./lib/settings/save-settings";
import Settings from "./types/settings.type";

const LONG_BREAK_MINUTES = 15;
const SESSION_NUM = 4;
const ROUND_NUM = 5;

export default function HomePage(props: any) {
  // User setting values
  // const [focusMinutes, setFocusMinutes] = useState<number>(25);
  // const [shortBreakMinutes, setShortBreakMinutes] = useState<number>(5);
  // const [longBreakMinutes, setLongBreakMinutes] = useState<number>(15);
  // const [isNotificationSoundOn, setIsNotificationSoundOn] =
  //   useState<boolean>(false);
  // const [isBackgroundSoundOn, setIsBackgroundSoundOn] =
  //   useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>({
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    isBackgroundSoundEnabled: false,
    isNotificationSoundEnabled: false,
  });

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
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const [breakStartSound, setBreakStartSound] = useState<Audio.Sound>();
  const [focusStartSound, setFocusStartSound] = useState<Audio.Sound>();
  const [backgroundSound, setBackgroundSound] = useState<Audio.Sound>();

  const transitThemeColor = useRef(new Animated.Value(1)).current;

  const updateColor = (status: PomodoroStatus) => {
    if (status === PomodoroStatus.Break) {
      Animated.timing(transitThemeColor, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(transitThemeColor, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const onStartButtonPressed = () => {
    setLapStartTime(new Date());
    setPomodoroStatus(PomodoroStatus.Focus);

    setUsedFocusMinutes(settings.focusMinutes);
    setUsedShortBreakMinutes(settings.shortBreakMinutes);
    setUsedLongBreakMinutes(settings.longBreakMinutes);

    setTimeout(() => {
      backgroundSound?.playAsync();
    }, 100);
  };

  const onPauseButtonPressed = () => {
    setIsPaused(true);
    setPausedTime(new Date());

    backgroundSound?.pauseAsync();
  };

  const onResumeButtonPressed = () => {
    if (pausedTime) {
      setPausedMillSeconds(
        pausedMillSeconds + (new Date().getTime() - pausedTime.getTime()),
      );
    }
    setIsPaused(false);
    setPausedTime(null);

    backgroundSound?.playAsync();
  };

  const onResetButtonPressed = () => {
    setElapsedSeconds(0);
    setPausedMillSeconds(0);
    setLapStartTime(new Date());
    setPausedTime(null);
    setIsPaused(false);
    setCompletedSessionCount(0);
    setPomodoroStatus(PomodoroStatus.None);

    backgroundSound?.stopAsync();
  };

  useEffect(() => {
    const prepare = async () => {
      try {
        const settings = await loadSettings();
        if (settings) setSettings(settings);
        setIsLoadingSettings(false);
      } catch (error) {
        // do nothing
      }
    };
    prepare();
  }, []);

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
        setUsedFocusMinutes(settings.focusMinutes);
        setUsedShortBreakMinutes(settings.shortBreakMinutes);
        setUsedLongBreakMinutes(settings.longBreakMinutes);

        if (settings.isNotificationSoundEnabled) {
          backgroundSound?.setVolumeAsync(1);
          await breakStartSound?.replayAsync();
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
        setUsedFocusMinutes(settings.focusMinutes);
        setUsedShortBreakMinutes(settings.shortBreakMinutes);
        setUsedLongBreakMinutes(settings.longBreakMinutes);

        if (settings.isNotificationSoundEnabled) {
          backgroundSound?.setVolumeAsync(1);
          await focusStartSound?.replayAsync();
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
    settings,
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
      if (isLoadingSettings) return;
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
        });

        const { sound: notificationSound } = await Audio.Sound.createAsync(
          require("../assets/sound/notification/school_bell.mp3"),
        );
        notificationSound.setOnPlaybackStatusUpdate((playbackStatus) => {
          if (playbackStatus.isLoaded) {
            if (playbackStatus.didJustFinish) {
              backgroundSound.setVolumeAsync(1);
            }
          }
        });
        setBreakStartSound(notificationSound);
        setFocusStartSound(notificationSound);

        const { sound: backgroundSound } = await Audio.Sound.createAsync(
          require("../assets/sound/background/Green_Cafe.mp3"),
        );
        backgroundSound.setIsLoopingAsync(true);
        backgroundSound.setVolumeAsync(
          settings.isBackgroundSoundEnabled ? 1 : 0,
        ); // same as default
        setBackgroundSound(backgroundSound);
      } catch (error) {
        console.error(error);
      }
    };

    loadSound();
  }, [isLoadingSettings]);

  useEffect(() => {
    updateColor(pomodoroStatus);
  }, [pomodoroStatus]);

  useEffect(() => {
    backgroundSound?.setVolumeAsync(settings.isBackgroundSoundEnabled ? 1 : 0);
  }, [settings.isBackgroundSoundEnabled]);

  useEffect(() => {
    const saveData = async () => {
      if (!isLoadingSettings) {
        await saveSettings(settings);
      }
    };
    saveData();
  }, [settings, isLoadingSettings]);

  const LAP_MINUTES =
    pomodoroStatus === PomodoroStatus.Focus
      ? usedFocusMinutes
      : (completedSessionCount + 1) % 4 === 0
        ? usedLongBreakMinutes
        : usedShortBreakMinutes;
  const remainingSeconds = LAP_MINUTES * 60 - elapsedSeconds;

  if (isLoadingSettings) return;

  return (
    <Animated.View
      className="relative flex h-screen w-full flex-col px-4 pt-8"
      style={{
        backgroundColor: transitThemeColor.interpolate({
          inputRange: [0, 1],
          outputRange: ["rgb(9, 130, 146)", "rgb(245, 92, 103)"],
        }),
      }}
      onTouchEnd={() => {
        setIsSettingOpen(false);
      }}
    >
      <View className="absolute right-4 top-16 flex flex-row gap-x-2">
        <View
          onTouchEnd={(e: any) => {
            e.stopPropagation();
            if (isSettingOpen) {
              setIsSettingOpen(false);
            } else {
              setSettings((prev) => {
                return {
                  ...prev,
                  isBackgroundSoundEnabled: !prev.isBackgroundSoundEnabled,
                };
              });
            }
          }}
          className="z-10 mr-1 flex w-12 flex-col items-center"
        >
          <View>
            <MaterialCommunityIcons
              name={settings.isBackgroundSoundEnabled ? "music" : "music-off"}
              color="#FFFFFF"
              size={34}
            />
          </View>
          <Text className="mt-[2px] font-dm-bold tracking-tighter text-white">
            ＢＧＭ
          </Text>
        </View>
        <View
          onTouchEnd={(e: any) => {
            e.stopPropagation();
            if (isSettingOpen) {
              setIsSettingOpen(false);
            } else {
              setSettings((prev) => {
                return {
                  ...prev,
                  isNotificationSoundEnabled: !prev.isNotificationSoundEnabled,
                };
              });
            }
          }}
          className="z-10 flex w-12 flex-col items-start"
        >
          <View className="ml-[2px]">
            <FontAwesomeIcon
              name={
                settings.isNotificationSoundEnabled
                  ? "volume-high"
                  : "volume-xmark"
              }
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
          className="z-10 flex flex-col items-center"
        >
          <IonIcon name={"settings-sharp"} color="#FFFFFF" size={32} />
          <Text className="mt-1 font-dm-bold text-white">設定</Text>
        </View>
      </View>
      {isSettingOpen && (
        <SettingView
          settings={settings}
          setSettings={setSettings}
          setIsOpen={setIsSettingOpen}
          transitThemeColor={transitThemeColor}
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
            ? ("0" + String(settings.focusMinutes)).slice(-2)
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
      <View className="flex flex-col gap-y-4">
        {pomodoroStatus === PomodoroStatus.None ? (
          <TransitionButton
            type="stroke"
            onPress={onStartButtonPressed}
            color={transitThemeColor}
          >
            開始
          </TransitionButton>
        ) : isPaused ? (
          <TransitionButton
            type="stroke"
            onPress={onResumeButtonPressed}
            color={transitThemeColor}
          >
            再開
          </TransitionButton>
        ) : (
          <TransitionButton
            type="stroke"
            onPress={onPauseButtonPressed}
            color={transitThemeColor}
          >
            一時停止
          </TransitionButton>
        )}
        <TransitionButton
          type="stroke"
          onPress={onResetButtonPressed}
          color={transitThemeColor}
        >
          最初から
        </TransitionButton>
      </View>
    </Animated.View>
  );
}
