import { useLocalSearchParams, router } from 'expo-router';
import { useEffect } from 'react';

export default function EditPackageRoute() {
  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  useEffect(() => {
    router.replace({ pathname: '/(agency)/packages/create', params: { editPackageId: packageId } });
  }, [packageId]);
  return null;
}
