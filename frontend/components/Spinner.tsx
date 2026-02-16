export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8 border-2',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-4'
  };

  return (
    <div className={`${sizes[size]} border-[#A97E50] border-t-transparent rounded-full animate-spin`}></div>
  );
}
