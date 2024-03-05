import { Text as ReactNativeText } from "react-native";

export default function Text(props: any) {
  const { ...rest } = props;

  return (
    <ReactNativeText className={"font-dm"} {...rest}></ReactNativeText>
  );
}
