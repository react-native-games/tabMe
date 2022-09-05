import React, { FC } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: colors.button,
    borderRadius: 25,
    elevetion: 20,
    shadowColor: colors.buttonText,
    shadowOpacity: .6,
    shadowOffset: { width: 3, height: 3 },
  },
});

interface Props {
  onPress: (event: GestureResponderEvent) => unknown;
  disabled?: boolean;
  style?: any | undefined;
  title: string;
  testID?: string;
}

const Button: FC<Props> = ({ onPress, disabled, style, title, testID }) => {
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
          { color: disabled ? 'gray' : colors.button },
          style,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
