import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type ProfileGreetingProps = {
  name: string;
};

export default function ProfileGreeting({ name }: ProfileGreetingProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.greeting}>¡Hola, {name}!</Text>
        <Text style={styles.question}>¿Qué plan hoy?</Text>
      </View>
      <Image source={require('../assets/avatar-placeholder.png')} style={styles.avatar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBlock: {
    marginRight: 8,
    alignItems: 'flex-end',
  },
  greeting: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  question: {
    fontSize: 12,
    color: colors.textOnDarkSecondary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
});
