import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '../../constants/colors';

interface Props {
  style?: object;
  numberOfLines?: number;
  children: any;
}

const BoldText: FC<Props> = ({ style, children, numberOfLines }) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.boldText, style]}
    >
      {children}
    </Text>
  );
};

export default BoldText;

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
    color: colors.targetInner,
    fontSize: 30

  }
})