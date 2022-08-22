import AsyncStorage from '@react-native-community/async-storage';

const set = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

const get = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      const item = JSON.parse(value);
      if (item == null) return null;
      return item;
    }
  } catch (error) {
    console.log(error);
  }
};

const remove = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

export default {
  set,
  get,
  remove,
};
