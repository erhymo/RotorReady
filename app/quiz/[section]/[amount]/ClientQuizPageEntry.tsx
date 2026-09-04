"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ClientQuizPage = dynamic(() => import("./ClientQuizPage"), { ssr: false });

export default function ClientQuizPageEntry() {
  const params = useParams<{ section: string; amount: string }>()!;
  const section = decodeURIComponent(params.section as string);
  const rawAmount = decodeURIComponent((params.amount as string) ?? "");
  const amount = rawAmount === "all"
    ? null
    : Math.max(1, parseInt(rawAmount, 10) || 10);

  return <ClientQuizPage section={section} amount={amount} />;
}
