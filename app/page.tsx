"use client";

import { useState } from "react";

type Lang = "ja" | "en";
type Tab = "request" | "response" | "agent";

const GITHUB_URL = "https://github.com/kato9292929/APAC-Compliance-Agent";

/* ─────────────────────────────────────────────
   Copy strings
───────────────────────────────────────────── */
const copy = {
  ja: {
    banner: "WORLD_APP_ID 設定中 — 現在ステージング環境で動作しています",
    heroTitle1: "エージェントのKYCを、",
    heroTitle2: "5カ国同時に完結させる",
    heroSub:
      "APAC-wide KYC & AML screening for AI agents.\nPowered by World AgentKit + x402 Protocol.\n$1–$3 per verification. No subscription.",
    ctaPrimary: "APIドキュメントを見る",
    ctaSecondary: "x402scanで確認",
    countriesTitle: "対応5カ国 + 複数国同時照合",
    worldTitle: "人間性の証明が、KYCを信頼できるものにする",
    worldSub: "Powered by World AgentKit",
    problemTitle: "❌ 問題",
    solutionTitle: "✅ 解決",
    amlTitle: "3つの制裁リストを並列照合",
    amlNote: "Promise.allSettled で並列実行。タイムアウト：8,000〜15,000ms",
    privacyTitle: "個人情報は記録しない",
    apiTitle: "POST /api/kyc/verify",
    priceLabel: "$1.00 USDC on Base — Japan Corporate",
    x402Title: "2つのプロトコルが解決する問題",
    footerBuilt: "Built with World AgentKit + x402 Protocol",
    tabReq: "リクエスト例",
    tabRes: "レスポンス例",
    tabAgent: "For AI Agents",
  },
  en: {
    banner: "WORLD_APP_ID configuring — running on staging environment",
    heroTitle1: "APAC KYC for AI Agents,",
    heroTitle2: "Across 5 Countries at Once",
    heroSub:
      "APAC-wide KYC & AML screening for AI agents.\nPowered by World AgentKit + x402 Protocol.\n$1–$3 per verification. No subscription.",
    ctaPrimary: "View API Docs",
    ctaSecondary: "Check on x402scan",
    countriesTitle: "5 Countries + Multi-Country Screening",
    worldTitle: "Proof of Humanity Makes KYC Trustworthy",
    worldSub: "Powered by World AgentKit",
    problemTitle: "❌ Problem",
    solutionTitle: "✅ Solution",
    amlTitle: "3 Sanction Lists Screened in Parallel",
    amlNote: "Executed via Promise.allSettled. Timeout: 8,000–15,000ms",
    privacyTitle: "No PII Stored",
    apiTitle: "POST /api/kyc/verify",
    priceLabel: "$1.00 USDC on Base — Japan Corporate",
    x402Title: "Two Protocols, Two Problems Solved",
    footerBuilt: "Built with World AgentKit + x402 Protocol",
    tabReq: "Request",
    tabRes: "Response",
    tabAgent: "For AI Agents",
  },
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function SectionLabel({ children }: { children: string }) {
  return (
    <span
      style={{ color: "#3b82f6", fontFamily: "var(--font-geist-mono)" }}
      className="text-xs tracking-widest uppercase font-semibold"
    >
      {children}
    </span>
  );
}

function CountryCard({
  flag,
  name,
  sources,
  price,
  isMulti,
}: {
  flag: string;
  name: string;
  sources: string[];
  price: string;
  isMulti?: boolean;
}) {
  return (
    <div
      className="card-hover flex flex-col gap-3 rounded-xl p-5 border"
      style={{ background: "#111111", borderColor: "#1f1f1f" }}
    >
      <div className="flex items-center gap-2 text-xl">
        <span>{flag}</span>
        <span className="font-semibold text-white text-sm">{name}</span>
      </div>
      <ul className="flex flex-col gap-1">
        {sources.map((s) => (
          <li
            key={s}
            className="text-xs"
            style={{ color: "#888888", fontFamily: "var(--font-geist-mono)" }}
          >
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-2 border-t" style={{ borderColor: "#1f1f1f" }}>
        <span
          className="text-sm font-bold"
          style={{ color: isMulti ? "#d4af37" : "#00ff87" }}
        >
          {price}
        </span>
      </div>
    </div>
  );
}

function AmlCard({
  icon,
  title,
  sub,
}: {
  icon: string;
  title: string;
  sub: string;
}) {
  return (
    <div
      className="card-hover flex flex-col gap-3 rounded-xl p-6 border text-center"
      style={{ background: "#111111", borderColor: "#1f1f1f" }}
    >
      <div className="text-3xl">{icon}</div>
      <div className="font-semibold text-white text-sm">{title}</div>
      <div className="text-xs" style={{ color: "#888888" }}>
        {sub}
      </div>
    </div>
  );
}

function PrivacyCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div
      className="card-hover flex flex-col gap-3 rounded-xl p-6 border"
      style={{ background: "#111111", borderColor: "#1f1f1f" }}
    >
      <div className="text-2xl">{icon}</div>
      <div className="font-semibold text-white text-sm">{title}</div>
      <div className="text-xs leading-relaxed" style={{ color: "#888888" }}>
        {body}
      </div>
    </div>
  );
}

/* ── Code block helper ── */
function Code({ lines }: { lines: React.ReactNode[] }) {
  return (
    <pre
      className="rounded-xl p-5 text-xs leading-relaxed overflow-x-auto"
      style={{
        background: "#0d0d0d",
        border: "1px solid #1f1f1f",
        fontFamily: "var(--font-geist-mono)",
      }}
    >
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </pre>
  );
}

const B = "#93c5fd"; // key blue
const G = "#86efac"; // string green
const GN = "#00ff87"; // bool green
const GO = "#d4af37"; // number gold
const PI = "#f9a8d4"; // command pink
const PU = "#c4b5fd"; // flag purple
const OR = "#fdba74"; // url orange
const GR = "#888888"; // comment grey

function Span({ c, children }: { c: string; children: React.ReactNode }) {
  return <span style={{ color: c }}>{children}</span>;
}

const REQUEST_LINES: React.ReactNode[] = [
  <Span c={PI}>curl</Span>,
  <><Span c={PU}>  -X</Span> <Span c={G}>POST</Span> <Span c={OR}>https://x402aca.vercel.app/api/kyc/verify</Span> \</>,
  <><Span c={PU}>  -H</Span> <Span c={G}>&quot;Content-Type: application/json&quot;</Span> \</>,
  <><Span c={PU}>  -H</Span> <Span c={G}>&quot;X-PAYMENT: &lt;x402 payment token&gt;&quot;</Span> \</>,
  <><Span c={PU}>  -d</Span> <Span c={G}>&apos;&#123;</Span></>,
  <><Span c={B}>    &quot;entity_type&quot;</Span><Span c={GR}>:</Span> <Span c={G}>&quot;corporate&quot;</Span>,</>,
  <><Span c={B}>    &quot;country&quot;</Span><Span c={GR}>:</Span> <Span c={G}>&quot;JP&quot;</Span>,</>,
  <><Span c={B}>    &quot;name&quot;</Span><Span c={GR}>:</Span> <Span c={G}>&quot;株式会社サンプル&quot;</Span>,</>,
  <><Span c={B}>    &quot;identifier&quot;</Span><Span c={GR}>:</Span> <Span c={G}>&quot;1234567890123&quot;</Span>,</>,
  <><Span c={B}>    &quot;world_proof&quot;</Span><Span c={GR}>:</Span> <Span c={G}>&quot;&lt;World ID proof&gt;&quot;</Span></>,
  <Span c={G}>  &#125;&apos;</Span>,
];

const RESPONSE_LINES: React.ReactNode[] = [
  <Span c={GR}>&#123;</Span>,
  <><Span c={B}>  &quot;verified&quot;</Span><Span c={GR}>:</Span> <Span c={GN}>true</Span>,</>,
  <><Span c={B}>  &quot;risk_score&quot;</Span><Span c={GR}>:</Span> <Span c={G}>&quot;low&quot;</Span>,</>,
  <><Span c={B}>  &quot;aml_clear&quot;</Span><Span c={GR}>:</Span> <Span c={GN}>true</Span>,</>,
  <><Span c={B}>  &quot;sanctions_clear&quot;</Span><Span c={GR}>:</Span> <Span c={GN}>true</Span>,</>,
  <><Span c={B}>  &quot;pep_clear&quot;</Span><Span c={GR}>:</Span> <Span c={GN}>true</Span>,</>,
  <><Span c={B}>  &quot;data_sources&quot;</Span><Span c={GR}>:</Span> [</>,
  <><Span c={G}>    &quot;NTA Corporate Number System (法人番号システム)&quot;</Span>,</>,
  <><Span c={G}>    &quot;OFAC SDN / OpenSanctions Consolidated Sanctions&quot;</Span>,</>,
  <><Span c={G}>    &quot;UN Security Council Consolidated List&quot;</Span>,</>,
  <><Span c={G}>    &quot;OpenSanctions PEP Database&quot;</Span></>,
  <>  ],</>,
  <><Span c={B}>  &quot;timestamp&quot;</Span><Span c={GR}>:</Span> <Span c={G}>&quot;2026-05-16T12:00:00.000Z&quot;</Span></>,
  <Span c={GR}>&#125;</Span>,
];

const AGENT_LINES: React.ReactNode[] = [
  <Span c={GR}>// AI Agent SDK example (TypeScript)</Span>,
  <></>,
  <><Span c={PU}>import</Span> <Span c={GR}>&#123;</Span> <Span c={B}>preparePaymentHeader</Span> <Span c={GR}>&#125;</Span> <Span c={PU}>from</Span> <Span c={G}>&quot;x402/client&quot;</Span>;</>,
  <></>,
  <><Span c={PU}>const</Span> <Span c={B}>payment</Span> = <Span c={PU}>await</Span> preparePaymentHeader(wallet, paymentRequirements);</>,
  <></>,
  <><Span c={PU}>const</Span> <Span c={B}>res</Span> = <Span c={PU}>await</Span> fetch(<Span c={G}>&quot;https://x402aca.vercel.app/api/kyc/verify&quot;</Span>, <Span c={GR}>&#123;</Span></>,
  <>  method: <Span c={G}>&quot;POST&quot;</Span>,</>,
  <>  headers: <Span c={GR}>&#123;</Span></>,
  <>    <Span c={G}>&quot;Content-Type&quot;</Span>: <Span c={G}>&quot;application/json&quot;</Span>,</>,
  <>    <Span c={G}>&quot;X-PAYMENT&quot;</Span>: <Span c={B}>payment</Span>,   <Span c={GR}>// x402 auto-pays $1 USDC</Span></>,
  <>  <Span c={GR}>&#125;</Span>,</>,
  <>  body: JSON.stringify(<Span c={GR}>&#123;</Span></>,
  <>    entity_type: <Span c={G}>&quot;corporate&quot;</Span>, country: <Span c={G}>&quot;JP&quot;</Span>,</>,
  <>    name: <Span c={G}>&quot;株式会社サンプル&quot;</Span>, identifier: <Span c={G}>&quot;1234567890123&quot;</Span>,</>,
  <>    world_proof: <Span c={B}>worldProof</Span>,  <Span c={GR}>// from World AgentKit</Span></>,
  <>  <Span c={GR}>&#125;</Span>),</>,
  <><Span c={GR}>&#125;</Span>);</>,
];

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function Home() {
  const [lang, setLang] = useState<Lang>("ja");
  const [tab, setTab] = useState<Tab>("request");
  const t = copy[lang];

  const countries = [
    {
      flag: "🇯🇵",
      name: lang === "ja" ? "日本" : "Japan",
      sources: ["NTA 法人番号システム", "My Number 検証"],
      price: "$1.00/verify",
    },
    {
      flag: "🇸🇬",
      name: lang === "ja" ? "シンガポール" : "Singapore",
      sources: ["ACRA BizFile+", "NRIC/FIN 検証"],
      price: "$1.00/verify",
    },
    {
      flag: "🇭🇰",
      name: lang === "ja" ? "香港" : "Hong Kong",
      sources: ["HK Companies Registry", "HKID 検証"],
      price: "$1.00/verify",
    },
    {
      flag: "🇦🇺",
      name: lang === "ja" ? "オーストラリア" : "Australia",
      sources: ["ABR ABN Lookup", "ABN チェックサム"],
      price: "$1.50/verify",
    },
    {
      flag: "🇰🇷",
      name: lang === "ja" ? "韓国" : "Korea",
      sources: ["공공데이터포털", "사업자등록 진위확인"],
      price: "$1.50/verify",
    },
  ];

  const tabLines: Record<Tab, React.ReactNode[]> = {
    request: REQUEST_LINES,
    response: RESPONSE_LINES,
    agent: AGENT_LINES,
  };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>

      {/* ── Banner ── */}
      <div
        className="text-center py-2 text-xs"
        style={{
          background: "#1a1a00",
          borderBottom: "1px solid #333300",
          color: "#d4af37",
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        ⚠ {t.banner}
      </div>

      {/* ── Nav ── */}
      <nav
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "#1f1f1f" }}
      >
        <div
          className="flex items-center gap-2 font-bold text-base tracking-tight"
          style={{ fontFamily: "var(--font-geist-mono)", color: "#3b82f6" }}
        >
          <span style={{ color: "#00ff87" }}>◆</span>
          APAC Compliance Agent
        </div>
        <div className="flex items-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1 rounded border transition-colors duration-200"
            style={{
              borderColor: "#1f1f1f",
              color: "#888888",
              fontFamily: "var(--font-geist-mono)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#1f1f1f";
              (e.currentTarget as HTMLElement).style.color = "#888888";
            }}
          >
            GitHub
          </a>
          <button
            onClick={() => setLang(lang === "ja" ? "en" : "ja")}
            className="text-xs px-3 py-1 rounded border transition-colors duration-200"
            style={{
              borderColor: "#3b82f6",
              color: "#3b82f6",
              background: "transparent",
              fontFamily: "var(--font-geist-mono)",
              cursor: "pointer",
            }}
          >
            {lang === "ja" ? "EN" : "JP"}
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 pt-20 pb-24 text-center animate-fade-in-up max-w-4xl mx-auto">
        <div className="mb-6">
          <SectionLabel>World AgentKit × x402 Protocol</SectionLabel>
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
          style={{ letterSpacing: "-0.02em" }}
        >
          <span className="block">{t.heroTitle1}</span>
          <span style={{ color: "#3b82f6" }}>{t.heroTitle2}</span>
        </h1>
        <p
          className="text-sm sm:text-base leading-relaxed mb-10 whitespace-pre-line"
          style={{ color: "#888888", fontFamily: "var(--font-geist-mono)" }}
        >
          {t.heroSub}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#api"
            className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200"
            style={{ background: "#3b82f6", color: "#fff" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#2563eb")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#3b82f6")
            }
          >
            {t.ctaPrimary}
          </a>
          <a
            href="#"
            className="px-6 py-3 rounded-lg font-semibold text-sm border transition-all duration-200"
            style={{ borderColor: "#1f1f1f", color: "#888888" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#1f1f1f";
              (e.currentTarget as HTMLElement).style.color = "#888888";
            }}
          >
            {t.ctaSecondary}
          </a>
        </div>
      </section>

      {/* ── Countries ── */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <SectionLabel>Coverage</SectionLabel>
          <h2 className="text-2xl font-bold mt-3">{t.countriesTitle}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {countries.map((c) => (
            <CountryCard key={c.name} {...c} />
          ))}
          {/* Multi-country card */}
          <CountryCard
            flag="🌏"
            name={lang === "ja" ? "複数国同時" : "Multi-Country"}
            sources={["Promise.allSettled", lang === "ja" ? "並列実行" : "Parallel execution"]}
            price="$3.00/verify"
            isMulti
          />
        </div>
      </section>

      {/* ── World AgentKit ── */}
      <section
        className="px-6 py-16 border-y"
        style={{ borderColor: "#1f1f1f" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>World AgentKit</SectionLabel>
            <h2 className="text-2xl font-bold mt-3">{t.worldTitle}</h2>
            <p
              className="text-sm mt-2"
              style={{ color: "#3b82f6", fontFamily: "var(--font-geist-mono)" }}
            >
              {t.worldSub}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Problem */}
            <div
              className="rounded-xl p-6 border"
              style={{ background: "#110808", borderColor: "#2a1111" }}
            >
              <div
                className="font-bold mb-4 text-sm"
                style={{ color: "#ff4444", fontFamily: "var(--font-geist-mono)" }}
              >
                {t.problemTitle}
              </div>
              {[
                lang === "ja"
                  ? "1人が1,000体のエージェントを操作"
                  : "One person controls 1,000 agents",
                lang === "ja"
                  ? "プラットフォームが識別できない"
                  : "Platform cannot distinguish them",
                lang === "ja"
                  ? "KYCスクリーニングの意味が失われる"
                  : "KYC screening loses its meaning",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-2 items-start text-sm py-2 border-b last:border-0"
                  style={{ borderColor: "#2a1111", color: "#cc8888" }}
                >
                  <span style={{ color: "#ff4444" }}>✗</span>
                  {item}
                </div>
              ))}
            </div>
            {/* Solution */}
            <div
              className="rounded-xl p-6 border"
              style={{ background: "#081108", borderColor: "#112211" }}
            >
              <div
                className="font-bold mb-4 text-sm"
                style={{ color: "#00ff87", fontFamily: "var(--font-geist-mono)" }}
              >
                {t.solutionTitle}
              </div>
              {[
                lang === "ja"
                  ? "World IDプルーフで人間性を検証"
                  : "World ID proof verifies humanity",
                lang === "ja"
                  ? "nullifier_hashで重複実行を検知"
                  : "nullifier_hash detects duplicate submissions",
                lang === "ja"
                  ? "1人1アクションを暗号学的に保証"
                  : "One action per human, cryptographically enforced",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-2 items-start text-sm py-2 border-b last:border-0"
                  style={{ borderColor: "#112211", color: "#88cc88" }}
                >
                  <span style={{ color: "#00ff87" }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AML ── */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <SectionLabel>AML Screening</SectionLabel>
          <h2 className="text-2xl font-bold mt-3">{t.amlTitle}</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 mb-6">
          <AmlCard
            icon="🛡️"
            title="OFAC SDN"
            sub={
              lang === "ja"
                ? "米国財務省制裁リスト\n（Office of Foreign Assets Control）"
                : "U.S. Treasury Sanctions List\n(Office of Foreign Assets Control)"
            }
          />
          <AmlCard
            icon="🌍"
            title="OpenSanctions"
            sub={
              lang === "ja"
                ? "制裁リスト・PEPリスト\nオープンソース統合データベース"
                : "Sanctions & PEP Lists\nOpen-source consolidated database"
            }
          />
          <AmlCard
            icon="🇺🇳"
            title={lang === "ja" ? "UN統合リスト" : "UN Consolidated List"}
            sub={
              lang === "ja"
                ? "国連安保理制裁リスト\n（Security Council）"
                : "UN Security Council\nConsolidated Sanctions List"
            }
          />
        </div>
        <div
          className="text-center text-xs py-3 rounded-lg"
          style={{
            color: "#888888",
            background: "#111111",
            border: "1px solid #1f1f1f",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          {t.amlNote}
        </div>
      </section>

      {/* ── Privacy ── */}
      <section
        className="px-6 py-16 border-y"
        style={{ borderColor: "#1f1f1f" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Privacy by Design</SectionLabel>
            <h2 className="text-2xl font-bold mt-3">{t.privacyTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <PrivacyCard
              icon="🔒"
              title={
                lang === "ja"
                  ? "SHA-256前16文字のみ保存"
                  : "SHA-256 Hash Only (16 chars)"
              }
              body={
                lang === "ja"
                  ? "識別子のハッシュのみを監査ログに保存。氏名・番号は一切記録しない。"
                  : "Only a truncated SHA-256 of the identifier is stored. No names or raw document numbers."
              }
            />
            <PrivacyCard
              icon="⚡"
              title={
                lang === "ja" ? "ログの最小化" : "Minimal Logging"
              }
              body={
                lang === "ja"
                  ? "監査証跡に必要な最小限の情報のみ保持。コンプライアンス要件を満たしつつ、個人情報への影響を最小化。"
                  : "Only the minimum information required for audit trails is retained, balancing compliance with privacy."
              }
            />
            <PrivacyCard
              icon="🕐"
              title={
                lang === "ja" ? "タイムアウト保護" : "Timeout Protection"
              }
              body={
                lang === "ja"
                  ? "全外部API呼び出しにAbortSignalでタイムアウトを設定。ハングを防ぎ、安定したレスポンスタイムを保証。"
                  : "All external API calls are guarded with AbortSignal timeouts to prevent hangs and ensure stable response times."
              }
            />
          </div>
        </div>
      </section>

      {/* ── API Section ── */}
      <section id="api" className="px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <SectionLabel>API Reference</SectionLabel>
          <h2
            className="text-2xl font-bold mt-3"
            style={{ fontFamily: "var(--font-geist-mono)", color: "#3b82f6" }}
          >
            {t.apiTitle}
          </h2>
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-1 p-1 rounded-lg mb-4 w-fit"
          style={{ background: "#111111", border: "1px solid #1f1f1f" }}
        >
          {(["request", "response", "agent"] as Tab[]).map((tabId) => (
            <button
              key={tabId}
              onClick={() => setTab(tabId)}
              className="px-4 py-2 rounded-md text-xs font-medium transition-all duration-150"
              style={{
                background: tab === tabId ? "#3b82f6" : "transparent",
                color: tab === tabId ? "#fff" : "#888888",
                fontFamily: "var(--font-geist-mono)",
                cursor: "pointer",
                border: "none",
              }}
            >
              {tabId === "request"
                ? t.tabReq
                : tabId === "response"
                ? t.tabRes
                : t.tabAgent}
            </button>
          ))}
        </div>

        <Code lines={tabLines[tab]} />

        {/* Price badge */}
        <div className="flex items-center gap-3 mt-4">
          <div
            className="px-3 py-1 rounded text-xs font-semibold"
            style={{
              background: "#0d2010",
              color: "#00ff87",
              border: "1px solid #00ff8733",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {t.priceLabel}
          </div>
          <div
            className="px-3 py-1 rounded text-xs"
            style={{
              background: "#0a1020",
              color: "#3b82f6",
              border: "1px solid #3b82f633",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            USDC on Base
          </div>
        </div>
      </section>

      {/* ── x402 + World AgentKit explanation ── */}
      <section
        className="px-6 py-16 border-y"
        style={{ borderColor: "#1f1f1f" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Protocol Stack</SectionLabel>
            <h2 className="text-2xl font-bold mt-3">{t.x402Title}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* x402 */}
            <div
              className="card-hover rounded-xl p-6 border"
              style={{ background: "#111111", borderColor: "#1f1f1f" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ background: "#1a1030", color: "#c4b5fd" }}
                >
                  x402
                </div>
                <span className="font-semibold text-white text-sm">
                  {lang === "ja"
                    ? "エージェントがどうやって支払うか"
                    : "How agents pay"}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {[
                  lang === "ja" ? "APIキー不要" : "No API keys required",
                  lang === "ja" ? "サブスク不要" : "No subscription",
                  lang === "ja"
                    ? "使った分だけ $1〜$3 USDC on Base"
                    : "Pay-per-use: $1–$3 USDC on Base",
                  lang === "ja"
                    ? "HTTP 402 で支払い情報を自動交換"
                    : "Payment info exchanged via HTTP 402",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 items-start text-xs"
                    style={{ color: "#888888" }}
                  >
                    <span style={{ color: "#c4b5fd" }}>→</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* World AgentKit */}
            <div
              className="card-hover rounded-xl p-6 border"
              style={{ background: "#111111", borderColor: "#1f1f1f" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ background: "#0a1a10", color: "#00ff87" }}
                >
                  World AgentKit
                </div>
                <span className="font-semibold text-white text-sm">
                  {lang === "ja"
                    ? "誰の代わりに動いているか"
                    : "Who is behind the agent"}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {[
                  lang === "ja"
                    ? "World IDで人間性を暗号学的に証明"
                    : "Cryptographic proof of humanity via World ID",
                  lang === "ja"
                    ? "シビル攻撃（1人が多数エージェント）を防止"
                    : "Prevents Sybil attacks (one human, many agents)",
                  lang === "ja"
                    ? "nullifier_hashで1アクション1人を強制"
                    : "nullifier_hash enforces one action per human",
                  lang === "ja"
                    ? "KYCの信頼性を根本から担保"
                    : "Grounds KYC trustworthiness at the root",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 items-start text-xs"
                    style={{ color: "#888888" }}
                  >
                    <span style={{ color: "#00ff87" }}>→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-6 py-10 text-center border-t"
        style={{ borderColor: "#1f1f1f" }}
      >
        <div
          className="text-sm mb-4"
          style={{ color: "#888888", fontFamily: "var(--font-geist-mono)" }}
        >
          {t.footerBuilt}
        </div>
        <div className="flex items-center justify-center gap-6 text-xs">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={{ color: "#888888" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#fff")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#888888")
            }
          >
            GitHub →
          </a>
          <span
            className="px-2 py-1 rounded text-xs"
            style={{
              background: "#111111",
              border: "1px solid #1f1f1f",
              color: "#888888",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            x402scan: coming soon
          </span>
        </div>
        <div className="mt-6 text-xs" style={{ color: "#444444" }}>
          {lang === "ja"
            ? "本サービスは照合・スクリーニング結果を提供するものであり、法的判断や審査結果を保証するものではありません。"
            : "This service provides screening results only and does not guarantee legal determinations or final compliance decisions."}
        </div>
      </footer>
    </div>
  );
}
