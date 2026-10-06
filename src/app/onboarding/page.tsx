import { Logo } from "@/components/logo";
import { COUNTRIES, CURRENCIES_SORTED } from "@/lib/geo";
import { requireUser } from "@/server/session";
import { OnboardingForm } from "./onboarding-form";

export const metadata = { title: "Set up your business" };

export default async function OnboardingPage() {
  const { user } = await requireUser();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted/40 px-4 py-12">
      <Logo />
      <div className="w-full max-w-md">
        <OnboardingForm firstName={user.name.split(" ")[0]} countries={COUNTRIES} currencies={CURRENCIES_SORTED} />
      </div>
    </div>
  );
}
