import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';

const COLORS = {
  border: '#E4E9DF',
  danger: '#B5392B',
  green: '#176B4D',
  greenPressed: '#12553D',
  ink: '#17221D',
  muted: '#65736B',
  white: '#FFFFFF',
} as const;

export default function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(
    null
  );
  const login = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data);
  };

  function resetLoginState() {
    if (!login.isPending) login.reset();
  }

  return (
    <View style={styles.formCard}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Correo</Text>
        <View
          style={[
            styles.inputShell,
            focusedField === 'email' && styles.inputShellFocused,
            errors.email && styles.inputShellInvalid,
          ]}
        >
          <Mail color={COLORS.muted} size={15} strokeWidth={1.8} />
          <Controller
            control={control}
            name="email"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                accessibilityLabel="Correo"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                onBlur={() => {
                  onBlur();
                  setFocusedField(null);
                }}
                onChangeText={(text) => {
                  onChange(text);
                  resetLoginState();
                }}
                onFocus={() => setFocusedField('email')}
                placeholder="rosa@gmail.com"
                placeholderTextColor={COLORS.muted}
                returnKeyType="next"
                style={styles.input}
                value={value}
              />
            )}
          />
        </View>
        {errors.email?.message ? (
          <Text accessibilityRole="alert" style={styles.fieldError}>
            {errors.email.message}
          </Text>
        ) : null}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <View
          style={[
            styles.inputShell,
            focusedField === 'password' && styles.inputShellFocused,
            errors.password && styles.inputShellInvalid,
          ]}
        >
          <Lock color={COLORS.muted} size={15} strokeWidth={1.8} />
          <Controller
            control={control}
            name="password"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                accessibilityLabel="Contraseña"
                autoCapitalize="none"
                autoComplete="current-password"
                onBlur={() => {
                  onBlur();
                  setFocusedField(null);
                }}
                onChangeText={(text) => {
                  onChange(text);
                  resetLoginState();
                }}
                onFocus={() => setFocusedField('password')}
                onSubmitEditing={() => void handleSubmit(onSubmit)()}
                placeholder="••••••••"
                placeholderTextColor={COLORS.muted}
                returnKeyType="go"
                secureTextEntry={!isPasswordVisible}
                style={styles.input}
                value={value}
              />
            )}
          />
          <Pressable
            accessibilityLabel={
              isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setIsPasswordVisible((visible) => !visible)}
            style={styles.passwordToggle}
          >
            {isPasswordVisible ? (
              <Eye color={COLORS.muted} size={15} strokeWidth={1.8} />
            ) : (
              <EyeOff color={COLORS.muted} size={15} strokeWidth={1.8} />
            )}
          </Pressable>
        </View>
        {errors.password?.message ? (
          <Text accessibilityRole="alert" style={styles.fieldError}>
            {errors.password.message}
          </Text>
        ) : null}
      </View>

      <View style={styles.forgotRow}>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={login.isPending}
        onPress={() => void handleSubmit(onSubmit)()}
        style={({ pressed }) => [
          styles.submitButton,
          pressed && !login.isPending && styles.submitButtonPressed,
          login.isPending && styles.submitButtonDisabled,
        ]}
      >
        {login.isPending ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : null}
        <Text style={styles.submitButtonText}>
          {login.isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Text>
        {!login.isPending ? (
          <ArrowRight color={COLORS.white} size={15} strokeWidth={2} />
        ) : null}
      </Pressable>

      {login.error ? (
        <Text accessibilityRole="alert" style={styles.requestError}>
          {login.error.message}
        </Text>
      ) : null}
      {login.data ? (
        <Text accessibilityRole="status" style={styles.successMessage}>
          Sesión iniciada. Bienvenido, {login.data.user.name}.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    width: '100%',
    gap: 13,
    padding: 16,
    paddingHorizontal: 0,
    borderRadius: 20,
    borderCurve: 'continuous',
    backgroundColor: COLORS.white,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: COLORS.muted,
    fontSize: 10.5,
    fontWeight: '600',
  },
  inputShell: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: COLORS.white,
  },
  inputShellFocused: {
    borderColor: COLORS.green,
  },
  inputShellInvalid: {
    borderColor: COLORS.danger,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    color: COLORS.ink,
    fontSize: 12,
  },
  passwordToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  fieldError: {
    color: COLORS.danger,
    fontSize: 11,
  },
  forgotRow: {
    paddingVertical: 2,
  },
  forgotText: {
    color: COLORS.green,
    fontSize: 10.5,
  },
  submitButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    borderCurve: 'continuous',
    backgroundColor: COLORS.green,
    paddingHorizontal: 16,
  },
  submitButtonPressed: {
    backgroundColor: COLORS.greenPressed,
  },
  submitButtonDisabled: {
    opacity: 0.75,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 12.5,
    fontWeight: '700',
  },
  requestError: {
    color: COLORS.danger,
    fontSize: 12,
    textAlign: 'center',
  },
  successMessage: {
    color: COLORS.green,
    fontSize: 12,
    textAlign: 'center',
  },
});
