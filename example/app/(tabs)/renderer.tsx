import { SafeAreaView, StyleSheet } from 'react-native';
import { Renderer } from '@markerjs/react-native-markerjs';

const RendererPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Renderer />
    </SafeAreaView>
  );
};

export default RendererPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
