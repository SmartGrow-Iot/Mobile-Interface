import React from 'react';
import {StyleSheet} from 'react-native';
import {Layout, Text, Button} from '@ui-kitten/components';

export default function ContactScreen({navigation}) {
  return (
    <Layout style={styles.container}>
      <Text category="h1">Contact Us</Text>
      <Text style={styles.text}>This is the contact page</Text>

      <Button style={styles.button} onPress={() => navigation.goBack()}>
        Go Back
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    marginTop: 20,
    minWidth: 200,
  },
});
