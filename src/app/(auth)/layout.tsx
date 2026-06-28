export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background blobs for auth pages could be added here if desired */}
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-display font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-recovery">
          GlassFit
        </h1>
        {children}
      </div>
    </div>
  )
}
