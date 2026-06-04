import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function IndexPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href={"/(auth)/splash" as any} />;
  }

  if (user.role === 'VENDOR') {
    return <Redirect href="/(vendor)" />;
  }

  if (user.role === 'INFLUENCER') {
    return <Redirect href="/(influencer)" />;
  }

  if (user.role === 'ADMIN') {
    return <Redirect href="/(admin)" />;
  }

  return <Redirect href={"/(auth)/splash" as any} />;
}
