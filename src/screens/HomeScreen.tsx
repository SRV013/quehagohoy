import { View, StyleSheet } from 'react-native';

import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content} />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  content: {
    flex: 1,
  },
});
