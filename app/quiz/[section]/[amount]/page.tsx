"use client";


import dynamic from "next/dynamic";

const ClientQuizPage = dynamic(() => import("./ClientQuizPage"), { ssr: false });

export default function QuizPage({ params }: any) {
  const section = decodeURIComponent(params.section);
  const amount = Math.max(1, parseInt(params.amount, 10) || 10);
  return <ClientQuizPage section={section} amount={amount} />;
}
