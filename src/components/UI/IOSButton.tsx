import React, { FC } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    padding: 10,
  },
});

interface Props {
  onPress: (event: GestureResponderEvent) => unknown;
  disabled?: boolean;
  style?: any | undefined;
  title: string;
  testID?: string;
}

const IOSButton: FC<Props> = ({ onPress, disabled, style, title, testID }) => {
  return (
    <TouchableOpacity
      // style={{ height: 100 }}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
    >
      <Text
        style={[
          styles.text,
          { fontSize: 30 },
          { color: disabled ? 'gray' : '#fff' },
          style,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default IOSButton;
