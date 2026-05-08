type Props = {
  children: React.ReactNode;
};

export default function PageContainer({ children }: Props) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {children}
    </div>
  );
}