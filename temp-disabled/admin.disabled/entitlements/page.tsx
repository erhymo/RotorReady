import { adminDb } from "@/lib/firebase/admin";

async function getByEmail(email: string) {
  const snap = await adminDb.collection("users").where("email", "==", email).limit(1).get();
  if (!snap.empty) return { id: snap.docs[0].id, data: snap.docs[0].data() };
  const idx = await adminDb.collection("users_by_email").doc(email).get();
  if (idx.exists) return { id: `users_by_email/${email}`, data: idx.data() };
  return null;
}

async function getByUid(uid: string) {
  const doc = await adminDb.collection("users").doc(uid).get();
  return doc.exists ? { id: uid, data: doc.data() } : null;
}

export default async function EntitlementsPage({ searchParams }: any) {
  const sp = await searchParams;
  const email = (sp?.email || "").toLowerCase();
  const uid = sp?.uid || "";
  let result: any = null;
  if (email) result = await getByEmail(email);
  else if (uid) result = await getByUid(uid);

  async function updateEntitlements(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").toLowerCase();
    const uid = String(formData.get("uid") || "");
    const AW169 = formData.get("AW169") === "on";
    const AW189 = formData.get("AW189") === "on";
    const AW139 = formData.get("AW139") === "on";

    if (uid) {
      await adminDb.collection("users").doc(uid).set({ entitlements: { AW169, AW189, AW139 } }, { merge: true });
    } else if (email) {
      await adminDb.collection("users_by_email").doc(email).set({ entitlements: { AW169, AW189, AW139 } }, { merge: true });
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Entitlements</h1>

      <form className="bg-white dark:bg-zinc-900 dark:border-zinc-700 border rounded-xl p-4 grid gap-3" action="/admin/entitlements">
        <div className="text-sm">Søk etter bruker</div>
        <input name="email" placeholder="E-post" defaultValue={email} className="border rounded px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" />
        <div className="text-center text-xs text-slate-500">eller</div>
        <input name="uid" placeholder="UID" defaultValue={uid} className="border rounded px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" />
        <button className="px-3 py-2 rounded bg-blue-600 text-white w-full">Søk</button>
      </form>

      {result && (
        <form className="bg-white dark:bg-zinc-900 dark:border-zinc-700 border rounded-xl p-4 grid gap-3" action={updateEntitlements}>
          <div className="text-sm">Resultat</div>
          <div className="text-xs text-slate-500">Doc: {result.id}</div>
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="uid" value={result.id.startsWith("users_by_email/") ? "" : uid} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="AW169" defaultChecked={Boolean(result.data?.entitlements?.AW169)} /> AW169</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="AW189" defaultChecked={Boolean(result.data?.entitlements?.AW189)} /> AW189</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="AW139" defaultChecked={Boolean(result.data?.entitlements?.AW139)} /> AW139</label>
          <button className="px-3 py-2 rounded bg-emerald-600 text-white w-full">Oppdater</button>
        </form>
      )}
    </div>
  );
}
