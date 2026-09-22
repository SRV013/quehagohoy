import { View, StyleSheet } from 'react-native';

import BottomNav from '../components/BottomNav';
import CategoryList from '../components/CategoryList';
import FilterBar from '../components/FilterBar';
import Header from '../components/Header';
import HeroHeading from '../components/HeroHeading';
import SearchBar from '../components/SearchBar';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <HeroHeading />
      <FilterBar />
      <SearchBar />
      <CategoryList />
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
