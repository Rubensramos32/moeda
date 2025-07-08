import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const storedUser = await AsyncStorage.getItem('user');
      setIsRegistering(!storedUser); // Se não tem usuário salvo, mostra registro
    }
    checkUser();
  }, []);

  async function handlePress() {
    if (isRegistering) {
      if (!username || !password || !confirmPassword) {
        Alert.alert('Erro', 'Preencha todos os campos!');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem!');
        return;
      }

      // Salvar o usuário como objeto JSON
      const userData = { username, password };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('isLoggedIn', 'true');
      onLogin(); // Login automático após cadastro
    } else {
      const storedUser = await AsyncStorage.getItem('user');

      if (storedUser) {
        const { username: savedUsername, password: savedPassword } = JSON.parse(storedUser);

        if (savedUsername === username && savedPassword === password) {
          await AsyncStorage.setItem('isLoggedIn', 'true');
          onLogin(); // Login bem-sucedido
        } else {
          Alert.alert('Erro', 'Usuário ou senha incorretos!');
        }
      } else {
        Alert.alert('Erro', 'Nenhum usuário cadastrado!');
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Crie sua conta' : 'Faça login'}</Text>

      <TextInput
        placeholder="Usuário"
        placeholderTextColor="#6B7280"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#6B7280"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {isRegistering && (
        <TextInput
          placeholder="Confirmar Senha"
          placeholderTextColor="#6B7280"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>{isRegistering ? 'Registrar' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#FAF9FB',
  },
  title: { 
    fontSize: 28, 
    marginBottom: 20, 
    textAlign: 'center', 
    fontWeight: '700',
    color: '#1F2937',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF', 
    color: '#000000', 
    marginBottom: 10, 
    padding: 12, 
    borderRadius: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});


