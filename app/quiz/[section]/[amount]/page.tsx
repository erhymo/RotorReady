"use client";


import dynamic from "next/dynamic";

const ClientQuizPage = dynamic(() => import("./ClientQuizPage"), { ssr: false });

type PageParams = {
  params: {
    section: string;
    amount: string;
  };
};

export default function QuizPage({ params }: PageParams) {
  const section = decodeURIComponent(params.section);
  const rawAmount = decodeURIComponent(params.amount ?? "");
  const amount = rawAmount === "all"
    ? null
    : Math.max(1, parseInt(rawAmount, 10) || 10);

  return <ClientQuizPage section={section} amount={amount} />;
}
