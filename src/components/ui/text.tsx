import { Text as ReactNativeText } from "react-native";

type Props = {
  className?: string;
  style?: any;
  children: any;
};

export default function Text(props: Props) {
  const { className, style, children } = props;

  return (
    <ReactNativeText
      className={"font-dm".concat(" ", className || "")}
      style={style}
    >
      {children}
    </ReactNativeText>
  );
}
