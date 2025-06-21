import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUserEmail = async email => {
    try {
      await AsyncStorage.setItem('email', JSON.stringify(email));
      console.log('email stored for remember me');
    } catch (error) {
      console.error('Error storing email for remembre me:', error);
    }
  };
  
  const getUserEmail = async () => {
    try {
      const emailValue = JSON.parse(await AsyncStorage.getItem('email'));
      console.log('getting email for the remember me', emailValue);
      return emailValue !== null ? {emailValue} : {emailValue: ''};
    } catch (error) {
      console.error('Error getting stored email fo rmemerme:', error);
      return null;
    }
  };
  
  const clearUserEmail = async () => {
    try {
      await AsyncStorage.removeItem('email');
      console.log('Email cleared from AsyncStorage');
    } catch (error) {
      console.error('Error clearing email from AsyncStorage:', error);
    }
  };
  
  const storeCheckStatus = async value => {
    try {
      await AsyncStorage.setItem('checkStatus', JSON.stringify(value));
      console.log('check value stored for remember me');
    } catch (error) {
      console.error('Error storing check value for remember me:', error);
    }
  };
  
  const getCheckStatus = async () => {
    try {
      const checkValue = JSON.parse(await AsyncStorage.getItem('checkStatus'));
      console.log('getting check value for remember me:', checkValue);
      return checkValue !== null ? {checkValue} : {checkValue: false};
    } catch (error) {
      console.error('Error getting check value for remember me:', error);
      return null;
    }
  };
  
  export {
    clearUserEmail,
    getCheckStatus,
    getUserEmail,
    storeCheckStatus,
    storeUserEmail,
  };