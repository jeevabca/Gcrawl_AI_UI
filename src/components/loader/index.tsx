interface LoaderProps {
  loading: boolean;
}

export default function Loader({
  loading,
}: LoaderProps) {
  if (!loading) return null;

  return <div>Loading...</div>;
}