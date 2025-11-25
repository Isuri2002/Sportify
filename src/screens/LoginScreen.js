import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { loginFailure, loginStart, loginSuccess } from '../redux/authSlice';
import { loginUser } from '../services/api';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SHADOWS, SPACING } from '../constants/theme';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values, { setSubmitting }) => {
    dispatch(loginStart());
    try {
      const response = await loginUser(values.username, values.password);
      dispatch(loginSuccess(response));
      navigation.replace('Main');
    } catch (error) {
      dispatch(loginFailure());
      Alert.alert('Login Failed', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Feather name="award" size={70} color={COLORS.primary} />
          <Text style={styles.appTitle}>Sportify</Text>
          <Text style={styles.appSubtitle}>Your Sports Companion</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Welcome Back!</Text>
          <Text style={styles.formSubtitle}>Sign in to continue</Text>

          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputContainer}>
                    <Feather name="user" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Username"
                      placeholderTextColor={COLORS.textLight}
                      value={values.username}
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      autoCapitalize="none"
                    />
                  </View>
                  {touched.username && errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}
                </View>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputContainer}>
                    <Feather name="lock" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Password"
                      placeholderTextColor={COLORS.textLight}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Feather 
                        name={showPassword ? 'eye-off' : 'eye'} 
                        size={20} 
                        color={COLORS.textLight} 
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.loginButtonText}>Login</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>
              Don't have an account? <Text style={styles.registerButtonTextBold}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl * 2,
    marginBottom: SPACING.xl,
  },
  appTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  appSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
  },
  formTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  formSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  inputWrapper: {
    marginBottom: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    ...SHADOWS.small,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  infoText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.info,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
  },
  registerButton: {
    alignItems: 'center',
  },
  registerButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
  },
  registerButtonTextBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
