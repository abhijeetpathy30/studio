

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex-grow">
        {children}
      </div>
  );
}
