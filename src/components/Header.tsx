import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import ProfileGreeting from './ProfileGreeting';

export default function Header() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Logo />
      <ProfileGreeting name={firstName} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
