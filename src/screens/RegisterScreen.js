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
import * as Yup from 'yup';
import { registerUser } from '../services/api';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SHADOWS, SPACING } from '../constants/theme';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, 'Password must contain at least one number and one symbol')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      await registerUser(values.username, values.email, values.password);
      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
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
          <Text style={styles.formTitle}>Create Account</Text>
          <Text style={styles.formSubtitle}>Sign up to get started</Text>

          <Formik
            initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
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
                    <Feather name="mail" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor={COLORS.textLight}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
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

                <View style={styles.inputWrapper}>
                  <View style={styles.inputContainer}>
                    <Feather name="lock" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Confirm Password"
                      placeholderTextColor={COLORS.textLight}
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Feather 
                        name={showConfirmPassword ? 'eye-off' : 'eye'} 
                        size={20} 
                        color={COLORS.textLight} 
                      />
                    </TouchableOpacity>
                  </View>
                  {values.confirmPassword && values.password && values.confirmPassword === values.password && (
                    <Text style={[styles.matchText, { color: 'green' }]}>Passwords match</Text>
                  )}
                  {values.confirmPassword && values.password && values.confirmPassword !== values.password && (
                    <Text style={[styles.matchText, { color: COLORS.error }]}>Passwords do not match</Text>
                  )}
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.registerButton, isSubmitting && styles.registerButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.registerButtonText}>Register</Text>
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
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>
              Already have an account? <Text style={styles.loginButtonTextBold}>Login</Text>
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
    marginTop: SPACING.xl,
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
  matchText: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    ...SHADOWS.small,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
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
  loginButton: {
    alignItems: 'center',
  },
  loginButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
  },
  loginButtonTextBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
