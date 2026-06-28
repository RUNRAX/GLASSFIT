import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="z-10 w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              card: "bg-white/5 border border-white/10 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-3xl",
              headerTitle: "text-2xl font-bold font-display text-white",
              headerSubtitle: "text-text-secondary",
              socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
              socialButtonsBlockButtonText: "text-white font-semibold",
              dividerLine: "bg-white/10",
              dividerText: "text-text-secondary",
              formFieldLabel: "text-text-secondary",
              formFieldInput: "bg-white/5 border border-white/10 text-white rounded-xl focus:border-accent-primary",
              formButtonPrimary: "bg-accent-primary text-base-dark font-bold hover:bg-accent-primary/90 rounded-xl",
              footerActionText: "text-text-secondary",
              footerActionLink: "text-accent-primary hover:text-accent-primary/80",
            }
          }}
        />
      </div>
    </div>
  );
}
