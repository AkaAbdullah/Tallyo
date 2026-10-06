import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { getSession } from "@/server/session";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  if (await getSession()) redirect("/dashboard");
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted/40 px-4 py-12">
      <Link href="/"><Logo /></Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
