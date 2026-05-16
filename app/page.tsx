"use client";

import { useState } from "react";

type Lang = "ja" | "en";
type Tab = "request" | "response" | "agent";

const GITHUB_URL = "https://github.com/kato9292929/APAC-Compliance-Agent";

const copy = {
  ja: {
    banner: "WORLD_APP_ID 設定中 — ステージング環境",
    heroLabel: "World AgentKit × x402 Protocol",
    heroTitle1: "エージェントのKYCを、",
    heroTitle2: "5カ国同時に完結させる",
    heroSub: "APAC-wide KYC & AML screening for AI agents.\n$1–$3 per verification. No subscription.",
    ctaPrimary: "APIドキュメントを見る",
    ctaSecondary: "x402scanで確認",
    countriesLabel: "Coverage",
    countriesTitle: "対応5カ国 + 複数国同時照合",
    worldLabel: "World AgentKit",
    worldTitle: "人間性の証明が、\nKYCを信頼できるものにする",
    worldSub: "Powered by World AgentKit",
    amlLabel: "AML Screening",
    amlTitle: "3つの制裁リストを並列照合",
    amlNote: "Promise.allSettled で並列実行 — タイムアウト 8,000〜15,000ms",
    privacyLabel: "Privacy by Design",
    privacyTitle: "個人情報は記録しない",
    apiLabel: "API Reference",
    apiTitle: "POST /api/kyc/verify",
    priceLabel: "$1.00 USDC on Base — Japan Corporate",
    protoLabel: "Protocol Stack",
    protoTitle: "2つのプロトコルが解決する問題",
    footerBuilt: "Built with World AgentKit + x402 Protocol",
    tabReq: "リクエスト",
    tabRes: "レスポンス",
    tabAgent: "AI Agent SDK",
  },
  en: {
    banner: "WORLD_APP_ID configuring — staging environment",
    heroLabel: "World AgentKit × x402 Protocol",
    heroTitle1: "APAC KYC for AI Agents,",
    heroTitle2: "Across 5 Countries at Once",
    heroSub: "APAC-wide KYC & AML screening for AI agents.\n$1–$3 per verification. No subscription.",
    ctaPrimary: "View API Docs",
    ctaSecondary: "Check on x402scan",
    countriesLabel: "Coverage",
    countriesTitle: "5 Countries + Multi-Country Screening",
    worldLabel: "World AgentKit",
    worldTitle: "Proof of Humanity\nMakes KYC Trustworthy",
    worldSub: "Powered by World AgentKit",
    amlLabel: "AML Screening",
    amlTitle: "3 Sanction Lists in Parallel",
    amlNote: "Executed via Promise.allSettled — Timeout: 8,000–15,000ms",
    privacyLabel: "Privacy by Design",
    privacyTitle: "No PII Stored",
    apiLabel: "API Reference",
    apiTitle: "POST /api/kyc/verify",
    priceLabel: "$1.00 USDC on Base — Japan Corporate",
    protoLabel: "Protocol Stack",
    protoTitle: "Two Protocols, Two Problems Solved",
    footerBuilt: "Built with World AgentKit + x402 Protocol",
    tabReq: "Request",
    tabRes: "Response",
    tabAgent: "AI Agent SDK",
  },
};

/* ── tiny helpers ── */
function Label({ children }: { children: string }) {
  return (
    <p className="text-xs tracking-[0.2em] uppercase font-semibold mb-5"
       style={{ color: "#3b82f6", fontFamily: "var(--font-geist-mono)" }}>
      {children}
    </p>
  );
}

function Span({ c, children }: { c: string; children: React.ReactNode }) {
  return <span style={{ color: c }}>{children}</span>;
}

/* ── Country card ── */
function CountryCard({ flag, name, sources, price, gold }: {
  flag: string; name: string; sources: string[]; price: string; gold?: boolean;
}) {
  return (
    <div className="card-hover flex flex-col gap-4 rounded-2xl p-7 border"
         style={{ background: "#111111", borderColor: "#1f1f1f" }}>
      <div className="text-2xl">{flag}</div>
      <div className="font-semibold text-white">{name}</div>
      <ul className="flex flex-col gap-1.5 flex-1">
        {sources.map((s) => (
          <li key={s} className="text-xs" style={{ color: "#666", fontFamily: "var(--font-geist-mono)" }}>
            {s}
          </li>
        ))}
      </ul>
      <div className="pt-4 border-t" style={{ borderColor: "#1f1f1f" }}>
        <span className="text-sm font-bold" style={{ color: gold ? "#d4af37" : "#00ff87" }}>
          {price}
        </span>
      </div>
    </div>
  );
}

/* ── Code syntax tokens ── */
const B = "#93c5fd", G = "#86efac", GN = "#00ff87", GO = "#d4af37",
      PI = "#f9a8d4", PU = "#c4b5fd", OR = "#fdba74", GR = "#666";

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
  <><Span c={B}>  &quot;data_sources&quot;</Span><Span c={GR}>: [</Span></>,
  <><Span c={G}>    &quot;NTA 法人番号システム&quot;</Span>,</>,
  <><Span c={G}>    &quot;OFAC SDN / OpenSanctions&quot;</Span>,</>,
  <><Span c={G}>    &quot;UN Security Council Consolidated List&quot;</Span></>,
  <>  <Span c={GR}>],</Span></>,
  <><Span c={B}>  &quot;timestamp&quot;</Span><Span c={GR}>:</Span> <Span c={G}>&quot;2026-05-16T12:00:00.000Z&quot;</Span></>,
  <Span c={GR}>&#125;</Span>,
];

const AGENT_LINES: React.ReactNode[] = [
  <Span c={GR}>// TypeScript — x402 auto-pays, World ID proves humanity</Span>,
  <></>,
  <><Span c={PU}>import</Span> <Span c={GR}>&#123;</Span> <Span c={B}>preparePaymentHeader</Span> <Span c={GR}>&#125;</Span> <Span c={PU}>from</Span> <Span c={G}>&quot;x402/client&quot;</Span>;</>,
  <></>,
  <><Span c={PU}>const</Span> <Span c={B}>payment</Span> = <Span c={PU}>await</Span> preparePaymentHeader(wallet, requirements);</>,
  <></>,
  <><Span c={PU}>const</Span> <Span c={B}>res</Span> = <Span c={PU}>await</Span> fetch(<Span c={G}>&quot;/api/kyc/verify&quot;</Span>, <Span c={GR}>&#123;</Span></>,
  <>  method: <Span c={G}>&quot;POST&quot;</Span>,</>,
  <>  headers: <Span c={GR}>&#123;</Span> <Span c={G}>&quot;X-PAYMENT&quot;</Span>: <Span c={B}>payment</Span> <Span c={GR}>&#125;</Span>,</>,
  <>  body: JSON.stringify(<Span c={GR}>&#123;</Span></>,
  <>    country: <Span c={G}>&quot;JP&quot;</Span>, entity_type: <Span c={G}>&quot;corporate&quot;</Span>,</>,
  <>    identifier: <Span c={G}>&quot;1234567890123&quot;</Span>,</>,
  <>    world_proof: <Span c={B}>worldProof</Span>, <Span c={GR}>// World AgentKit</Span></>,
  <>  <Span c={GR}>&#125;</Span>),</>,
  <><Span c={GR}>&#125;</Span>);</>,
];

function CodeBlock({ lines }: { lines: React.ReactNode[] }) {
  return (
    <pre className="rounded-2xl p-7 text-xs leading-7 overflow-x-auto"
         style={{ background: "#0d0d0d", border: "1px solid #1f1f1f", fontFamily: "var(--font-geist-mono)" }}>
      {lines.map((l, i) => <div key={i}>{l}</div>)}
    </pre>
  );
}

/* ═══════════════════════════════════════════════
   Page
═══════════════════════════════════════════════ */
export default function Home() {
  const [lang, setLang] = useState<Lang>("ja");
  const [tab, setTab]   = useState<Tab>("request");
  const t = copy[lang];

  const countries = [
    { flag: "🇯🇵", name: lang === "ja" ? "日本" : "Japan",
      sources: ["NTA 法人番号システム", "My Number 検証"], price: "$1.00 / verify" },
    { flag: "🇸🇬", name: lang === "ja" ? "シンガポール" : "Singapore",
      sources: ["ACRA BizFile+", "NRIC/FIN 検証"], price: "$1.00 / verify" },
    { flag: "🇭🇰", name: lang === "ja" ? "香港" : "Hong Kong",
      sources: ["HK Companies Registry", "HKID 検証"], price: "$1.00 / verify" },
    { flag: "🇦🇺", name: lang === "ja" ? "オーストラリア" : "Australia",
      sources: ["ABR ABN Lookup", "ABN チェックサム"], price: "$1.50 / verify" },
    { flag: "🇰🇷", name: lang === "ja" ? "韓国" : "Korea",
      sources: ["공공데이터포털", "사업자등록 진위확인"], price: "$1.50 / verify" },
    { flag: "🌏", name: lang === "ja" ? "複数国同時" : "Multi-Country",
      sources: ["Promise.allSettled", lang === "ja" ? "並列実行" : "Parallel"], price: "$3.00 / verify", gold: true },
  ];

  const tabLines: Record<Tab, React.ReactNode[]> = {
    request: REQUEST_LINES, response: RESPONSE_LINES, agent: AGENT_LINES,
  };

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>

      {/* ── Banner ── */}
      <div className="text-center py-2 text-xs"
           style={{ background: "#111100", borderBottom: "1px solid #2a2400",
                    color: "#d4af37", fontFamily: "var(--font-geist-mono)" }}>
        ⚠ {t.banner}
      </div>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-8 py-5 border-b"
           style={{ borderColor: "#1a1a1a" }}>
        <span className="font-bold tracking-tight text-sm"
              style={{ fontFamily: "var(--font-geist-mono)", color: "#3b82f6" }}>
          <span style={{ color: "#00ff87" }}>◆</span> APAC Compliance Agent
        </span>
        <div className="flex items-center gap-3">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
             className="text-xs px-4 py-1.5 rounded-lg border transition-all duration-200"
             style={{ borderColor: "#222", color: "#666", fontFamily: "var(--font-geist-mono)" }}
             onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
             onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#222"; (e.currentTarget as HTMLElement).style.color = "#666"; }}>
            GitHub
          </a>
          <button onClick={() => setLang(lang === "ja" ? "en" : "ja")}
                  className="text-xs px-4 py-1.5 rounded-lg border transition-all duration-200"
                  style={{ borderColor: "#3b82f6", color: "#3b82f6", background: "transparent",
                           fontFamily: "var(--font-geist-mono)", cursor: "pointer" }}>
            {lang === "ja" ? "EN" : "JP"}
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════
          Hero
      ════════════════════════════════ */}
      <section className="text-center px-6 pt-32 pb-36 max-w-3xl mx-auto">
        <Label>{t.heroLabel}</Label>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-8"
            style={{ letterSpacing: "-0.03em" }}>
          <span className="block mb-2">{t.heroTitle1}</span>
          <span style={{ color: "#3b82f6" }}>{t.heroTitle2}</span>
        </h1>
        <p className="text-base leading-relaxed mb-12 whitespace-pre-line"
           style={{ color: "#666", fontFamily: "var(--font-geist-mono)" }}>
          {t.heroSub}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#api"
             className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
             style={{ background: "#3b82f6", color: "#fff" }}
             onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#2563eb")}
             onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#3b82f6")}>
            {t.ctaPrimary}
          </a>
          <a href="#"
             className="px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all duration-200"
             style={{ borderColor: "#222", color: "#666" }}
             onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
             onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#222"; (e.currentTarget as HTMLElement).style.color = "#666"; }}>
            {t.ctaSecondary}
          </a>
        </div>
      </section>

      {/* ════════════════════════════════
          Countries
      ════════════════════════════════ */}
      <section className="px-6 py-28 border-t max-w-6xl mx-auto" style={{ borderColor: "#1a1a1a" }}>
        <div className="text-center mb-16">
          <Label>{t.countriesLabel}</Label>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ letterSpacing: "-0.02em" }}>
            {t.countriesTitle}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {countries.map((c) => (
            <CountryCard key={c.name} {...c} />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          World AgentKit
      ════════════════════════════════ */}
      <section className="px-6 py-28 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Label>{t.worldLabel}</Label>
            <h2 className="text-3xl sm:text-4xl font-bold whitespace-pre-line" style={{ letterSpacing: "-0.02em" }}>
              {t.worldTitle}
            </h2>
            <p className="text-sm mt-4" style={{ color: "#3b82f6", fontFamily: "var(--font-geist-mono)" }}>
              {t.worldSub}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Problem */}
            <div className="rounded-2xl p-8 border" style={{ background: "#0f0808", borderColor: "#2a1212" }}>
              <p className="text-xs font-bold mb-6 tracking-wider uppercase"
                 style={{ color: "#ff4444", fontFamily: "var(--font-geist-mono)" }}>
                {lang === "ja" ? "❌ 問題" : "❌ Problem"}
              </p>
              {[
                lang === "ja" ? "1人が1,000体のエージェントを操作" : "One person controls 1,000 agents",
                lang === "ja" ? "プラットフォームが識別できない" : "Platform cannot distinguish them",
                lang === "ja" ? "KYCスクリーニングの意味が失われる" : "KYC screening loses its meaning",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start py-4 border-b last:border-0"
                     style={{ borderColor: "#2a1212", color: "#aa6666" }}>
                  <span style={{ color: "#ff4444", flexShrink: 0 }}>✗</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            {/* Solution */}
            <div className="rounded-2xl p-8 border" style={{ background: "#080f08", borderColor: "#122212" }}>
              <p className="text-xs font-bold mb-6 tracking-wider uppercase"
                 style={{ color: "#00ff87", fontFamily: "var(--font-geist-mono)" }}>
                {lang === "ja" ? "✅ 解決" : "✅ Solution"}
              </p>
              {[
                lang === "ja" ? "World IDプルーフで人間性を検証" : "World ID proof verifies humanity",
                lang === "ja" ? "nullifier_hashで重複実行を検知" : "nullifier_hash detects duplicates",
                lang === "ja" ? "1人1アクションを暗号学的に保証" : "One action per human, cryptographically",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start py-4 border-b last:border-0"
                     style={{ borderColor: "#122212", color: "#66aa66" }}>
                  <span style={{ color: "#00ff87", flexShrink: 0 }}>✓</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          AML
      ════════════════════════════════ */}
      <section className="px-6 py-28 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Label>{t.amlLabel}</Label>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ letterSpacing: "-0.02em" }}>
              {t.amlTitle}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[
              { icon: "🛡️", title: "OFAC SDN",
                sub: lang === "ja" ? "米国財務省制裁リスト" : "U.S. Treasury Sanctions List" },
              { icon: "🌍", title: "OpenSanctions",
                sub: lang === "ja" ? "制裁リスト・PEPデータベース" : "Sanctions & PEP Database" },
              { icon: "🇺🇳", title: lang === "ja" ? "UN統合リスト" : "UN Consolidated List",
                sub: lang === "ja" ? "国連安保理制裁リスト" : "UN Security Council Sanctions" },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="card-hover text-center rounded-2xl p-8 border"
                   style={{ background: "#111111", borderColor: "#1f1f1f" }}>
                <div className="text-4xl mb-5">{icon}</div>
                <div className="font-semibold text-white mb-3">{title}</div>
                <div className="text-sm" style={{ color: "#666" }}>{sub}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs py-4"
             style={{ color: "#555", fontFamily: "var(--font-geist-mono)" }}>
            {t.amlNote}
          </p>
        </div>
      </section>

      {/* ════════════════════════════════
          Privacy
      ════════════════════════════════ */}
      <section className="px-6 py-28 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Label>{t.privacyLabel}</Label>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ letterSpacing: "-0.02em" }}>
              {t.privacyTitle}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "🔒",
                title: lang === "ja" ? "SHA-256前16文字のみ保存" : "SHA-256 Hash Only",
                body: lang === "ja"
                  ? "識別子のハッシュのみを監査ログに保存。氏名・番号は一切記録しない。"
                  : "Only a truncated SHA-256 hash is stored. No names or raw document numbers." },
              { icon: "⚡",
                title: lang === "ja" ? "ログの最小化" : "Minimal Logging",
                body: lang === "ja"
                  ? "監査証跡に必要な最小限の情報のみ保持。"
                  : "Only minimum information required for audit trails is retained." },
              { icon: "🕐",
                title: lang === "ja" ? "タイムアウト保護" : "Timeout Protection",
                body: lang === "ja"
                  ? "全外部API呼び出しにAbortSignalでタイムアウトを設定。"
                  : "All external API calls are guarded with AbortSignal timeouts." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="card-hover rounded-2xl p-8 border"
                   style={{ background: "#111111", borderColor: "#1f1f1f" }}>
                <div className="text-3xl mb-5">{icon}</div>
                <div className="font-semibold text-white mb-3">{title}</div>
                <div className="text-sm leading-relaxed" style={{ color: "#666" }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          API
      ════════════════════════════════ */}
      <section id="api" className="px-6 py-28 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Label>{t.apiLabel}</Label>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-geist-mono)", color: "#3b82f6" }}>
              {t.apiTitle}
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit"
               style={{ background: "#111", border: "1px solid #1f1f1f" }}>
            {(["request", "response", "agent"] as Tab[]).map((id) => (
              <button key={id} onClick={() => setTab(id)}
                      className="px-5 py-2 rounded-lg text-xs font-medium transition-all duration-150"
                      style={{ background: tab === id ? "#3b82f6" : "transparent",
                               color: tab === id ? "#fff" : "#555",
                               fontFamily: "var(--font-geist-mono)", cursor: "pointer", border: "none" }}>
                {id === "request" ? t.tabReq : id === "response" ? t.tabRes : t.tabAgent}
              </button>
            ))}
          </div>

          <CodeBlock lines={tabLines[tab]} />

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: "#0a1a0a", color: "#00ff87",
                           border: "1px solid #00ff8722", fontFamily: "var(--font-geist-mono)" }}>
              {t.priceLabel}
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs"
                  style={{ background: "#0a0f1a", color: "#3b82f6",
                           border: "1px solid #3b82f622", fontFamily: "var(--font-geist-mono)" }}>
              USDC on Base
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          Protocol Stack
      ════════════════════════════════ */}
      <section className="px-6 py-28 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Label>{t.protoLabel}</Label>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ letterSpacing: "-0.02em" }}>
              {t.protoTitle}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* x402 */}
            <div className="card-hover rounded-2xl p-8 border" style={{ background: "#111111", borderColor: "#1f1f1f" }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: "#16102a", color: "#c4b5fd" }}>x402</span>
                <span className="font-semibold text-white">
                  {lang === "ja" ? "エージェントがどうやって支払うか" : "How agents pay"}
                </span>
              </div>
              {[
                lang === "ja" ? "APIキー不要・サブスク不要" : "No API keys, no subscription",
                lang === "ja" ? "使った分だけ $1〜$3 USDC on Base" : "Pay-per-use: $1–$3 USDC on Base",
                lang === "ja" ? "HTTP 402 で支払い情報を自動交換" : "Payment info via HTTP 402",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start py-3.5 border-b last:border-0"
                     style={{ borderColor: "#1f1f1f", color: "#666" }}>
                  <span style={{ color: "#c4b5fd", flexShrink: 0 }}>→</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            {/* World AgentKit */}
            <div className="card-hover rounded-2xl p-8 border" style={{ background: "#111111", borderColor: "#1f1f1f" }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: "#081a10", color: "#00ff87" }}>World AgentKit</span>
                <span className="font-semibold text-white">
                  {lang === "ja" ? "誰の代わりに動いているか" : "Who is behind the agent"}
                </span>
              </div>
              {[
                lang === "ja" ? "World IDで人間性を暗号学的に証明" : "Cryptographic proof of humanity",
                lang === "ja" ? "シビル攻撃（多数エージェント）を防止" : "Prevents Sybil attacks",
                lang === "ja" ? "nullifier_hashで1人1アクションを強制" : "One action per human enforced",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start py-3.5 border-b last:border-0"
                     style={{ borderColor: "#1f1f1f", color: "#666" }}>
                  <span style={{ color: "#00ff87", flexShrink: 0 }}>→</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          Footer
      ════════════════════════════════ */}
      <footer className="px-6 py-16 border-t text-center" style={{ borderColor: "#1a1a1a" }}>
        <p className="text-sm mb-6" style={{ color: "#555", fontFamily: "var(--font-geist-mono)" }}>
          {t.footerBuilt}
        </p>
        <div className="flex items-center justify-center gap-6 mb-8">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
             className="text-sm transition-colors duration-200"
             style={{ color: "#555" }}
             onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#fff")}
             onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#555")}>
            GitHub →
          </a>
          <span className="px-3 py-1.5 rounded-lg text-xs"
                style={{ background: "#111", border: "1px solid #1f1f1f",
                         color: "#555", fontFamily: "var(--font-geist-mono)" }}>
            x402scan: coming soon
          </span>
        </div>
        <p className="text-xs max-w-lg mx-auto" style={{ color: "#333" }}>
          {lang === "ja"
            ? "本サービスは照合・スクリーニング結果を提供するものであり、法的判断や審査結果を保証するものではありません。"
            : "This service provides screening results only and does not guarantee legal determinations or final compliance decisions."}
        </p>
      </footer>
    </div>
  );
}
