import { login } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function doLogin(formData: FormData) {
  "use server";
  const ok = await login(String(formData.get("password") || ""));
  if (ok) redirect("/studio");
  redirect("/studio/login?e=1");
}

export default async function StudioLogin({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <div className="mx-auto max-w-sm px-4 pt-[calc(var(--header-h)+4rem)]">
      <h1 className="display display-md">Studio</h1>
      <p className="mt-2 text-ink-soft text-[0.95rem]">For Chhaya only.</p>
      <form action={doLogin} className="mt-6 grid gap-4">
        <div>
          <label htmlFor="pw" className="field-label">Passcode</label>
          <input id="pw" name="password" type="password" required className="field" autoFocus />
        </div>
        {e && <p className="text-[0.9rem] text-cocoa-700" role="alert">Wrong passcode.</p>}
        <button className="btn btn-cocoa w-full">Sign in</button>
      </form>
    </div>
  );
}
