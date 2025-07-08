import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

import LoginScreen from './LoginScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado para verificar carregamento
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para o tema

  const [salario, setSalario] = useState(0);
  const [rendaExtra, setRendaExtra] = useState(0);
  const [despesas, setDespesas] = useState(0);

  const [novoSalario, setNovoSalario] = useState('');
  const [novaRendaExtra, setNovaRendaExtra] = useState('');
  const [novaDespesa, setNovaDespesa] = useState('');
  const [categoriaDespesa, setCategoriaDespesa] = useState('Comida');

  const [historicoRendaExtra, setHistoricoRendaExtra] = useState([]);
  const [historicoDespesas, setHistoricoDespesas] = useState([]);

  const saldoFinal = salario + rendaExtra - despesas;

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1F2937' : '#E0E7FF', // Fundo dinâmico
      paddingTop: 20,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: isDarkMode ? '#E5E7EB' : '#1F2937', // Texto dinâmico
    },
    card: {
      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6', // Cartões dinâmicos
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      width: '100%',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
      color: isDarkMode ? '#E5E7EB' : '#374151', // Texto dinâmico
    },
    value: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 10,
      color: isDarkMode ? '#60A5FA' : '#4F46E5', // Valores dinâmicos
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#6B7280' : '#D1D5DB', // Bordas dinâmicas
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', // Fundo dinâmico
      color: isDarkMode ? '#E5E7EB' : '#000', // Texto dinâmico
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FAF9FB',
    },
    loadingText: {
      fontSize: 18,
      color: '#6B7280',
    },
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        const s = await AsyncStorage.getItem('salario');
        const r = await AsyncStorage.getItem('rendaExtra');
        const d = await AsyncStorage.getItem('despesas');
        const hRenda = await AsyncStorage.getItem('historicoRendaExtra');
        const hDesp = await AsyncStorage.getItem('historicoDespesas');

        if (s) setSalario(parseFloat(s));
        if (r) setRendaExtra(parseFloat(r));
        if (d) setDespesas(parseFloat(d));
        if (hRenda) setHistoricoRendaExtra(JSON.parse(hRenda));
        if (hDesp) setHistoricoDespesas(JSON.parse(hDesp));
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
      }
    }
    carregarDados();
  }, []);

  useEffect(() => {
    async function salvarDados() {
      try {
        await AsyncStorage.setItem('salario', salario.toString());
        await AsyncStorage.setItem('rendaExtra', rendaExtra.toString());
        await AsyncStorage.setItem('despesas', despesas.toString());
        await AsyncStorage.setItem('historicoRendaExtra', JSON.stringify(historicoRendaExtra));
        await AsyncStorage.setItem('historicoDespesas', JSON.stringify(historicoDespesas));
      } catch (error) {
        console.error('Erro ao salvar os dados:', error);
      }
    }
    salvarDados();
  }, [salario, rendaExtra, despesas, historicoRendaExtra, historicoDespesas]);

  useEffect(() => {
    async function checkLogin() {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const loggedIn = await AsyncStorage.getItem('isLoggedIn');

        if (storedUser && loggedIn === 'true') {
          setIsLoggedIn(true); // Usuário já está logado
        } else {
          setIsLoggedIn(false); // Exibir tela de login ou registro
        }
      } catch (error) {
        console.error('Erro ao verificar login:', error);
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    }
    checkLogin();
  }, []);

  function handleLogin() {
    setIsLoggedIn(true);
    AsyncStorage.setItem('isLoggedIn', 'true'); // Salva o estado de login
  }

  function handleLogout() {
    AsyncStorage.removeItem('isLoggedIn') // Remove o estado de login do AsyncStorage
      .then(() => {
        setIsLoggedIn(false); // Redefine o estado de login
      })
      .catch((error) => {
        console.error('Erro ao fazer logout:', error);
      });
  }

  function adicionarHistorico(tipo, valor, categoria = '') {
    const novaEntrada = {
      id: Date.now().toString(),
      tipo,
      valor,
      categoria,
      data: new Date().toLocaleString(),
    };
    if (tipo === 'Renda Extra') {
      setHistoricoRendaExtra([novaEntrada, ...historicoRendaExtra]);
    } else if (tipo === 'Despesa') {
      setHistoricoDespesas([novaEntrada, ...historicoDespesas]);
    }
  }

  function resetarTudo() {
    setSalario(0);
    setRendaExtra(0);
    setDespesas(0);
    setHistoricoRendaExtra([]);
    setHistoricoDespesas([]);
    
    // Limpa apenas os dados do histórico no AsyncStorage
    AsyncStorage.removeItem('salario');
    AsyncStorage.removeItem('rendaExtra');
    AsyncStorage.removeItem('despesas');
    AsyncStorage.removeItem('historicoRendaExtra');
    AsyncStorage.removeItem('historicoDespesas');
  }

  function calcularMaiorGasto() {
    const categorias = {};

    historicoDespesas.forEach((item) => {
      if (!categorias[item.categoria]) {
        categorias[item.categoria] = 0;
      }
      categorias[item.categoria] += item.valor;
    });

    let maiorCategoria = null;
    let maiorValor = 0;

    for (const categoria in categorias) {
      if (categorias[categoria] > maiorValor) {
        maiorCategoria = categoria;
        maiorValor = categorias[categoria];
      }
    }

    return { categoria: maiorCategoria, valor: maiorValor };
  }

  function excluirHistorico(tipo, id) {
    if (tipo === 'Renda Extra') {
      setHistoricoRendaExtra(historicoRendaExtra.filter(item => item.id !== id));
    } else if (tipo === 'Despesa') {
      setHistoricoDespesas(historicoDespesas.filter(item => item.id !== id));
    }
  }

  if (isLoading) {
    // Exibe uma tela de carregamento enquanto verifica o login
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <>
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>Bem-vindo ao App Moeda seu controle de gastos 💰</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons
                  name={isDarkMode ? 'brightness-7' : 'brightness-2'}
                  size={24}
                  color={isDarkMode ? '#FFF' : '#000'}
                />
                <Button
                  title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                  onPress={() => setIsDarkMode(!isDarkMode)}
                />
              </View>
              <Button
                title="Logout"
                color="red"
                onPress={handleLogout}
              />
            </View>

            <Button
              title="Zerar Tudo"
              color="red"
              onPress={() => {
                Alert.alert(
                  'Confirmação',
                  'Você tem certeza que deseja zerar tudo?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Sim', onPress: resetarTudo },
                  ],
                  { cancelable: true }
                );
              }}
              style={{ marginTop: 20 }} 
            />

            <View style={styles.card}>
              <Text style={styles.label}>Salário do mês</Text>
              <Text style={styles.value}>R$ {salario.toFixed(2)}</Text>
              <TextInput
                style={styles.input}
                placeholder="Novo salário"
                placeholderTextColor={isDarkMode ? '#E5E7EB' : '#6B7280'} 
                keyboardType="numeric"
                value={novoSalario}
                onChangeText={setNovoSalario}
              />
              <Button
                title="Atualizar Salário"
                onPress={() => {
                  const valor = parseFloat(novoSalario);
                  if (!isNaN(valor)) {
                    setSalario(valor);
                    adicionarHistorico('Salário', valor);
                  }
                  setNovoSalario('');
                }}
              />
              <View style={{ marginTop: 20 }}>
                <Button
                  title="Onde gastei mais?"
                  color="blue"
                  onPress={() => {
                    const maiorGasto = calcularMaiorGasto();
                    if (maiorGasto.categoria) {
                      Alert.alert(
                        'Maior Gasto',
                        `Você gastou mais em: ${maiorGasto.categoria}\nValor: R$ ${maiorGasto.valor.toFixed(2)}`
                      );
                    } else {
                      Alert.alert('Maior Gasto', 'Nenhuma despesa registrada.');
                    }
                  }}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.card, styles.receita]}>
                <Text style={styles.label}>Renda extra</Text>
                <Text style={styles.value}>R$ {rendaExtra.toFixed(2)}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+ ou - valor"
                  placeholderTextColor={isDarkMode ? '#E5E7EB' : '#6B7280'} // Texto do placeholder dinâmico
                  keyboardType="numeric"
                  value={novaRendaExtra}
                  onChangeText={setNovaRendaExtra}
                />
                <Button
                  title="Atualizar Renda Extra"
                  onPress={() => {
                    const valor = parseFloat(novaRendaExtra);
                    if (!isNaN(valor)) {
                      setRendaExtra(prev => prev + valor);
                      adicionarHistorico('Renda Extra', valor);
                    }
                    setNovaRendaExtra('');
                  }}
                />
              </View>

              <View style={[styles.card, styles.despesa]}>
                <Text style={styles.label}>Despesas</Text>
                <Text style={styles.value}>R$ {despesas.toFixed(2)}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+ ou - valor"
                  placeholderTextColor={isDarkMode ? '#E5E7EB' : '#6B7280'} // Texto do placeholder dinâmico
                  keyboardType="numeric"
                  value={novaDespesa}
                  onChangeText={setNovaDespesa}historicoDespesas
                  
                />
                <Picker
                  selectedValue={categoriaDespesa}
                  style={styles.input}
                  onValueChange={(itemValue) => setCategoriaDespesa(itemValue)}
                >
                  <Picker.Item label="Alimentação" value="Alimentação" />
                  <Picker.Item label="Farmácia" value="Farmácia" />
                  <Picker.Item label="Água" value="Água" />
                  <Picker.Item label="Luz" value="Luz" />
                  <Picker.Item label="Internet" value="Internet" />
                  <Picker.Item label="Aluguel" value="Aluguel" />
                  <Picker.Item label="Corrida de app" value="Corrida de app" />
                  <Picker.Item label="Fatura de cartão de crédito" value="Fatura de cartão de crédito" />
                  <Picker.Item label="Outros" value="outros" />
                </Picker>
                <Button
                  title="Atualizar Despesa"
                  onPress={() => {
                    const valor = parseFloat(novaDespesa);
                    if (!isNaN(valor)) {
                      setDespesas(prev => prev + valor);
                      adicionarHistorico('Despesa', valor, categoriaDespesa);
                    }
                    setNovaDespesa('');
                  }}
                />
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: '#DDEEFF' }]}>
              <Text style={styles.label}>Saldo final</Text>
              <Text style={styles.value}>R$ {saldoFinal.toFixed(2)}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Histórico de Renda Extra</Text>
              <View style={{ maxHeight: 150 }}>
                {historicoRendaExtra.map(item => (
                  <View key={item.id} style={styles.histItemContainer}>
                    <Text style={styles.histItem}>
                      {item.data} - {item.tipo}: R$ {item.valor.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => excluirHistorico('Renda Extra', item.id)}
                    >
                      <Text style={styles.deleteButtonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Histórico de Despesas</Text>
              <View style={{ maxHeight: 150 }}>
                {historicoDespesas.map(item => (
                  <View key={item.id} style={styles.histItemContainer}>
                    <Text style={styles.histItem}>
                      {item.data} - {item.tipo} ({item.categoria}): R$ {item.valor.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => excluirHistorico('Despesa', item.id)}
                    >
                      <Text style={styles.deleteButtonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

      

            <StatusBar style="auto" />
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E0E7FF',
    paddingTop: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center', // Centraliza os elementos horizontalmente
    paddingBottom: 40, // Adiciona espaço no final
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1F2937', // Cinza escuro para o texto
  },
  card: {
    backgroundColor: '#F3F4F6', // Cinza claro para os cartões
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%', // Garante que o cartão ocupe toda a largura disponível
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#374151', // Cinza médio para os textos dos cartões
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#4F46E5', // Azul escuro para os valores
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF', // Branco para os campos de entrada
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Garante que a linha ocupe toda a largura disponível
  },
  receita: {
    backgroundColor: '#E0F7FA', // Azul claro para "Renda Extra"
    width: '48%', // Define uma largura fixa para "Renda Extra"
    marginRight: 5, // Espaçamento entre as divs
  },
  despesa: {
    backgroundColor: '#FFEBEE', // Vermelho claro para "Despesas"
    width: '48%', // Define uma largura fixa para "Despesas"
    marginLeft: 5, // Espaçamento entre as divs
  },
  histItem: {
    fontSize: 14,
    color: '#6B7280', // Cinza médio para os itens do histórico
    marginBottom: 5,
  },
  menu: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  histItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B', // Vermelho claro
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

