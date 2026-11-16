import { StatusBar } from 'expo-status-bar';
import { MessageCircle } from 'lucide-react-native';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LoginForm from '../components/LoginForm';

const COLORS = {
  background: '#FFFFFF',
  greenSoft: '#D9F36A',
  ink: '#17221D',
  muted: '#65736B',
} as const;

export default function Login() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.topBar}>
            <View style={styles.brand}>
              <View style={styles.logo}>
                <Text style={styles.logoMark}>▥</Text>
              </View>
              <Text style={styles.brandName}>BarraBodega</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <Text style={styles.title}>Inicia Sesión</Text>
            <Text style={styles.subtitle}>
              Entra para ver cómo va tu bodega hoy.
            </Text>
          </View>

          <LoginForm />

          <View style={styles.supportRow}>
            <MessageCircle color={COLORS.muted} size={13} strokeWidth={1.8} />
            <Text style={styles.supportText}>
              ¿Problemas para entrar? Escríbenos
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  content: {
    width: '100%',
    maxWidth: 490,
    marginTop: 40, // respetar
    gap: 12,
  },
  topBar: {
    height: 32,
    justifyContent: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.greenSoft,
  },
  logoMark: {
    color: '#104B37',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  brandName: {
    color: COLORS.ink,
    fontSize: 14.5,
    letterSpacing: -0.5,
  },
  hero: {
    gap: 7,
    paddingVertical: 8,
  },
  title: {
    color: COLORS.ink,
    fontSize: 27,
    fontWeight: '400',
    lineHeight: 28,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 11.5,
    lineHeight: 17,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  supportText: {
    color: COLORS.muted,
    fontSize: 10.5,
  },
});
