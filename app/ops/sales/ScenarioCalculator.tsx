"use client";

import { useState } from "react";
import { SOFTWARE_PRICES } from "@/lib/billing/software-prices";

const prices = [
  { name: "Starter", amount: SOFTWARE_PRICES.starter.inrMonthly / 100 },
  { name: "Pro", amount: SOFTWARE_PRICES.pro.inrMonthly / 100 },
  { name: "Business", amount: SOFTWARE_PRICES.business.inrMonthly / 100 },
];

export default function ScenarioCalculator() {
  const [visitors, setVisitors] = useState(10_000);
  const [signupRate, setSignupRate] = useState(6);
  const [activationRate, setActivationRate] = useState(40);
  const [paidRate, setPaidRate] = useState(15);
  const [price, setPrice] = useState(prices[1].amount);
  const signups = Math.round(visitors * signupRate / 100);
  const activated = Math.round(signups * activationRate / 100);
  const paid = Math.round(activated * paidRate / 100);
  const input = "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm";
  return <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-bold">Monthly funnel scenario</h2><p className="mt-1 text-sm text-neutral-600">Editable forecast for new subscriptions, excluding GST.</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><label className="text-xs font-semibold">Visitors<input className={input} type="number" min="0" value={visitors} onChange={e => setVisitors(Math.max(0, Number(e.target.value)))} /></label><label className="text-xs font-semibold">Visitor → signup %<input className={input} type="number" min="0" max="100" value={signupRate} onChange={e => setSignupRate(Math.min(100, Math.max(0, Number(e.target.value))))} /></label><label className="text-xs font-semibold">Signup → published %<input className={input} type="number" min="0" max="100" value={activationRate} onChange={e => setActivationRate(Math.min(100, Math.max(0, Number(e.target.value))))} /></label><label className="text-xs font-semibold">Published → paid %<input className={input} type="number" min="0" max="100" value={paidRate} onChange={e => setPaidRate(Math.min(100, Math.max(0, Number(e.target.value))))} /></label><label className="text-xs font-semibold">Plan<select className={input} value={price} onChange={e => setPrice(Number(e.target.value))}>{prices.map(plan => <option key={plan.name} value={plan.amount}>{plan.name} · ₹{plan.amount.toLocaleString("en-IN")}</option>)}</select></label></div><div className="mt-5 grid gap-3 sm:grid-cols-4">{[["Signups", signups.toLocaleString("en-IN")], ["Published", activated.toLocaleString("en-IN")], ["Paid", paid.toLocaleString("en-IN")], ["New monthly revenue", `₹${(paid * price).toLocaleString("en-IN")}`]].map(([label, value]) => <div key={label} className="rounded-xl bg-neutral-50 p-4"><p className="text-xs text-neutral-500">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>)}</div><p className="mt-4 text-xs text-neutral-500">Scenario only. Excludes churn, failed payments, discounts, acquisition costs, annual contracts and single-event purchases.</p></section>;
}
