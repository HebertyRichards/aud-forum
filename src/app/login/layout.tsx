import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Faça o login, e interaja com a comunidade!",
  robots: {
    index: false,
    follow: false,
  }
};

export default function LoginRoot({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
