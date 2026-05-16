"use client";

import { useState } from "react";

type Tab = "request" | "response" | "agent";

const GITHUB_URL = "https://github.com/kato9292929/APAC-Compliance-Agent";

/* ── Tokens ── */
function Span({ c, children }: { c: string; children: React.ReactNode }) {
  return <span style={{ color: c }}>{children}</span>;
}
const B = "#93c5fd", G = "#86efac", GN = "#00ff87", PU = "#c4b5fd",
      PI = "#f9a8d4", OR = "#fdba74", GR = "#555";

/* ── Label above sections ── */
function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs tracking-[0.18em] uppercase mb-4"
       style={{ color: "#888888", fontFamily: "var(--font-geist-mono)" }}>
      {children}
    </p>
  );
}

/* ── Country card ── */
function CountryCard({ flag, name, sources, price, gold }: {
  flag: string; name: string; sources: string[]; price: string; gold?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl p-6 border transition-colors duration-200"
         style={{ background: "#111111", borderColor: "#1a1a1a" }}
         onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.5)"}
         onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a"}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{flag}</span>
        <span className="font-semibold text-white">{name}</span>
      </div>
      <ul className="flex flex-col gap-1.5 flex-1">
        {sources.map((s) => (
          <li key={s} className="text-xs"
              style={{ color: "#888888", fontFamily: "var(--font-geist-mono)" }}>
            {s}
          </li>
        ))}
      </ul>
      <div className="pt-4 border-t" style={{ borderColor: "#1a1a1a" }}>
        <span className="text-sm font-bold"
              style={{ color: gold ? "#d4af37" : "#00ff87" }}>
          {price}
        </span>
      </div>
    </div>
  );
}

/* ── Code block ── */
function CodeBlock({ lines }: { lines: React.ReactNode[] }) {
  return (
    <pre className="rounded-2xl p-6 text-xs leading-7 overflow-x-auto"
         style={{ background: "#0d0d0d", border: "1px solid #1a1a1a",
                  fontFamily: "var(--font-geist-mono)" }}>
      {lines.map((l, i) => <div key={i}>{l}</div>)}
    </pre>
  );
}

/* ── Code content ── */
const REQUEST_LINES: React.ReactNode[] = [
  <Span c={PI}>curl</Span>,
  <><Span c={PU}>  -X</Span> <Span c={G}>POST</Span> <Span c={OR}>https://x402aca.vercel.app/api/kyc/verify</Span> \</>,
  <><Span c={PU}>  -H</Span> <Span c={G}>&quot;Content-Type: application/json&quot;</Span> \</>,
  <><Span c={PU}>  -H</Span> <Span c={G}>&quot;X-PAYMENT: &lt;x402 payment token&gt;&quot;</Span> \</>,
  <><Span c={PU}>  -d</Span> <Span c={G}>&apos;&#123;</Span></>,
  <><Span c={B}>    &quot;entity_type&quot;</Span><Span c={GR}>:</Span> <Span c={G}>&quot;corporate&quot;</Span>,</>,
  <><Span c={B}>    &quot;country&quot;</Span><Span c={GR}>:</Span>      <Span c={G}>&quot;JP&quot;</Span>,</>,
  <><Span c={B}>    &quot;name&quot;</Span><Span c={GR}>:</Span>         <Span c={G}>&quot;株式会社サンプル&quot;</Span>,</>,
  <><Span c={B}>    &quot;identifier&quot;</Span><Span c={GR}>:</Span>   <Span c={G}>&quot;1234567890123&quot;</Span>,</>,
  <><Span c={B}>    &quot;world_proof&quot;</Span><Span c={GR}>:</Span>  <Span c={G}>&quot;&lt;World ID proof&gt;&quot;</Span></>,
  <Span c={G}>  &#125;&apos;</Span>,
];

const RESPONSE_LINES: React.ReactNode[] = [
  <Span c={GR}>&#123;</Span>,
  <><Span c={B}>  &quot;verified&quot;</Span><Span c={GR}>:</Span>        <Span c={GN}>true</Span>,</>,
  <><Span c={B}>  &quot;risk_score&quot;</Span><Span c={GR}>:</Span>      <Span c={G}>&quot;low&quot;</Span>,</>,
  <><Span c={B}>  &quot;aml_clear&quot;</Span><Span c={GR}>:</Span>       <Span c={GN}>true</Span>,</>,
  <><Span c={B}>  &quot;sanctions_clear&quot;</Span><Span c={GR}>:</Span>  <Span c={GN}>true</Span>,</>,
  <><Span c={B}>  &quot;pep_clear&quot;</Span><Span c={GR}>:</Span>       <Span c={GN}>true</Span>,</>,
  <><Span c={B}>  &quot;data_sources&quot;</Span><Span c={GR}>: [</Span></>,
  <><Span c={G}>    &quot;NTA 法人番号システム&quot;</Span>,</>,
  <><Span c={G}>    &quot;OFAC SDN / OpenSanctions&quot;</Span>,</>,
  <><Span c={G}>    &quot;UN Security Council Consolidated List&quot;</Span></>,
  <>  <Span c={GR}>],</Span></>,
  <><Span c={B}>  &quot;timestamp&quot;</Span><Span c={GR}>:</Span> <Span c={G}>&quot;2026-05-16T12:00:00.000Z&quot;</Span></>,
  <Span c={GR}>&#125;</Span>,
];

const AGENT_LINES: React.ReactNode[] = [
  <Span c={GR}>// TypeScript — x402が自動決済、World IDが人間性を証明</Span>,
  <></>,
  <><Span c={PU}>import</Span> <Span c={GR}>&#123;</Span> <Span c={B}>preparePaymentHeader</Span> <Span c={GR}>&#125;</Span> <Span c={PU}>from</Span> <Span c={G}>&quot;x402/client&quot;</Span>;</>,
  <></>,
  <><Span c={PU}>const</Span> <Span c={B}>payment</Span> = <Span c={PU}>await</Span> preparePaymentHeader(wallet, requirements);</>,
  <></>,
  <><Span c={PU}>const</Span> <Span c={B}>res</Span> = <Span c={PU}>await</Span> fetch(<Span c={G}>&quot;/api/kyc/verify&quot;</Span>, <Span c={GR}>&#123;</Span></>,
  <>  method: <Span c={G}>&quot;POST&quot;</Span>,</>,
  <>  headers: <Span c={GR}>&#123;</Span> <Span c={G}>&quot;X-PAYMENT&quot;</Span>: <Span c={B}>payment</Span> <Span c={GR}>&#125;</Span>,  <Span c={GR}>// $1 USDC 自動決済</Span></>,
  <>  body: JSON.stringify(<Span c={GR}>&#123;</Span></>,
  <>    country: <Span c={G}>&quot;JP&quot;</Span>, entity_type: <Span c={G}>&quot;corporate&quot;</Span>,</>,
  <>    identifier: <Span c={G}>&quot;1234567890123&quot;</Span>,</>,
  <>    world_proof: <Span c={B}>worldProof</Span>,  <Span c={GR}>// World AgentKit</Span></>,
  <>  <Span c={GR}>&#125;</Span>),</>,
  <><Span c={GR}>&#125;</Span>);</>,
];

/* ═══════════════════════════════════════
   Page
═══════════════════════════════════════ */
export default function Home() {
  const [tab, setTab] = useState<Tab>("request");

  const tabLines: Record<Tab, React.ReactNode[]> = {
    request: REQUEST_LINES,
    response: RESPONSE_LINES,
    agent: AGENT_LINES,
  };

  const countries = [
    { flag: "🇯🇵", name: "日本",           sources: ["NTA 法人番号システム", "My Number 検証"],  price: "$1.00 / verify" },
    { flag: "🇸🇬", name: "シンガポール",   sources: ["ACRA BizFile+", "NRIC/FIN 検証"],          price: "$1.00 / verify" },
    { flag: "🇭🇰", name: "香港",           sources: ["HK Companies Registry", "HKID 検証"],       price: "$1.00 / verify" },
    { flag: "🇦🇺", name: "オーストラリア", sources: ["ABR ABN Lookup", "ABN チェックサム検証"],    price: "$1.50 / verify" },
    { flag: "🇰🇷", name: "韓国",           sources: ["공공데이터포털", "사업자등록 진위확인"],     price: "$1.50 / verify" },
    { flag: "🌏",  name: "複数国同時照合", sources: ["Promise.allSettled", "並列実行"],            price: "$3.00 / verify", gold: true },
  ];

  return (
    <div style={{ background: "#0a0a0a", color: "#ffffff", minHeight: "100vh" }}>

      {/* ── Banner ── */}
      <p className="text-xs text-center py-1.5"
         style={{ color: "rgba(234,179,8,0.6)", borderBottom: "1px solid #1a1a1a",
                  fontFamily: "var(--font-geist-mono)" }}>
        ⚠ WORLD_APP_ID 設定中 — ステージング環境
      </p>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b"
           style={{ borderColor: "#1a1a1a" }}>
        <span className="font-bold text-sm tracking-tight"
              style={{ fontFamily: "var(--font-geist-mono)", color: "#3b82f6" }}>
          <span style={{ color: "#00ff87" }}>◆</span>{" "}APAC Compliance Agent
        </span>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
           className="text-xs px-4 py-1.5 rounded-lg border transition-colors duration-200"
           style={{ borderColor: "#1a1a1a", color: "#888888",
                    fontFamily: "var(--font-geist-mono)" }}
           onMouseEnter={e => {
             (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6";
             (e.currentTarget as HTMLElement).style.color = "#ffffff";
           }}
           onMouseLeave={e => {
             (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a";
             (e.currentTarget as HTMLElement).style.color = "#888888";
           }}>
          GitHub
        </a>
      </nav>

      {/* ════════════════════════════════
          Hero
      ════════════════════════════════ */}
      <section className="text-center px-6 pt-24 pb-24 max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.18em] uppercase mb-6"
           style={{ color: "#888888", fontFamily: "var(--font-geist-mono)" }}>
          World AgentKit × x402 Protocol
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5"
            style={{ letterSpacing: "-0.025em" }}>
          APAC 5カ国の法人照合・
          <br />
          <span style={{ color: "#3b82f6" }}>AMLスクリーニング</span>
        </h1>
        <p className="text-sm md:text-base mb-3"
           style={{ color: "#888888", fontFamily: "var(--font-geist-mono)" }}>
          KYB &amp; Sanctions Screening for AI agents across APAC.
        </p>
        <p className="text-sm md:text-base mb-10"
           style={{ color: "#888888", fontFamily: "var(--font-geist-mono)" }}>
          $1–$3 per verification. No signup. No subscription.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#api"
             className="px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
             style={{ background: "#3b82f6", color: "#ffffff" }}
             onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#2563eb")}
             onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#3b82f6")}>
            APIドキュメントを見る
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
             className="px-7 py-3 rounded-xl font-semibold text-sm border transition-colors duration-200"
             style={{ borderColor: "#1a1a1a", color: "#888888" }}
             onMouseEnter={e => {
               (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6";
               (e.currentTarget as HTMLElement).style.color = "#ffffff";
             }}
             onMouseLeave={e => {
               (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a";
               (e.currentTarget as HTMLElement).style.color = "#888888";
             }}>
            GitHub
          </a>
        </div>
      </section>

      {/* ════════════════════════════════
          Country Cards
      ════════════════════════════════ */}
      <section className="px-6 py-20 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Coverage</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold"
                style={{ letterSpacing: "-0.02em" }}>
              対応5カ国 + 複数国同時照合
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((c) => <CountryCard key={c.name} {...c} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          World AgentKit
      ════════════════════════════════ */}
      <section className="px-6 py-20 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>World AgentKit</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold"
                style={{ letterSpacing: "-0.02em" }}>
              人間性の証明が、KYCを信頼できるものにする
            </h2>
            <p className="text-sm mt-3" style={{ color: "#3b82f6", fontFamily: "var(--font-geist-mono)" }}>
              Powered by World AgentKit
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Problem */}
            <div className="rounded-2xl p-6 border"
                 style={{ background: "#0f0808", borderColor: "#2a1212" }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-6"
                 style={{ color: "#ff4444", fontFamily: "var(--font-geist-mono)" }}>
                ❌ 問題
              </p>
              {[
                "1人が1,000体のエージェントを操作",
                "プラットフォームが識別できない",
                "KYCスクリーニングの意味が失われる",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start py-4 border-b last:border-0"
                     style={{ borderColor: "#2a1212" }}>
                  <span style={{ color: "#ff4444", flexShrink: 0 }}>✗</span>
                  <span className="text-sm" style={{ color: "#aa6666" }}>{item}</span>
                </div>
              ))}
            </div>
            {/* Solution */}
            <div className="rounded-2xl p-6 border"
                 style={{ background: "#080f08", borderColor: "#122212" }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-6"
                 style={{ color: "#00ff87", fontFamily: "var(--font-geist-mono)" }}>
                ✅ 解決
              </p>
              {[
                "World IDプルーフで人間性を検証",
                "nullifier_hashで重複実行を検知",
                "1人1アクションを暗号学的に保証",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start py-4 border-b last:border-0"
                     style={{ borderColor: "#122212" }}>
                  <span style={{ color: "#00ff87", flexShrink: 0 }}>✓</span>
                  <span className="text-sm" style={{ color: "#66aa66" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          AML Screening
      ════════════════════════════════ */}
      <section className="px-6 py-20 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>AML Screening</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold"
                style={{ letterSpacing: "-0.02em" }}>
              3つの制裁リストを並列照合
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            {[
              { icon: "🛡️", title: "OFAC SDN",       sub: "米国財務省制裁リスト" },
              { icon: "🌍", title: "OpenSanctions",   sub: "制裁リスト・PEPデータベース" },
              { icon: "🇺🇳", title: "UN統合リスト",  sub: "国連安保理制裁リスト" },
            ].map(({ icon, title, sub }) => (
              <div key={title}
                   className="text-center rounded-2xl p-8 border transition-colors duration-200"
                   style={{ background: "#111111", borderColor: "#1a1a1a" }}
                   onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.5)"}
                   onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a"}>
                <div className="text-4xl mb-4">{icon}</div>
                <div className="font-semibold text-white mb-2">{title}</div>
                <div className="text-sm" style={{ color: "#888888" }}>{sub}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs" style={{ color: "#555555", fontFamily: "var(--font-geist-mono)" }}>
            Promise.allSettled で並列実行 — タイムアウト 8,000〜15,000ms
          </p>
        </div>
      </section>

      {/* ════════════════════════════════
          Privacy
      ════════════════════════════════ */}
      <section className="px-6 py-20 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Privacy by Design</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold"
                style={{ letterSpacing: "-0.02em" }}>
              個人情報は記録しない
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: "🔒",
                title: "SHA-256前16文字のみ保存",
                body: "識別子のハッシュのみを監査ログに保存。氏名・番号は一切記録しない。",
              },
              {
                icon: "⚡",
                title: "ログの最小化",
                body: "監査証跡に必要な最小限の情報のみ保持。コンプライアンスと個人情報保護を両立。",
              },
              {
                icon: "🕐",
                title: "タイムアウト保護",
                body: "全外部API呼び出しにAbortSignalでタイムアウトを設定。ハングを防止。",
              },
            ].map(({ icon, title, body }) => (
              <div key={title}
                   className="rounded-2xl p-6 border transition-colors duration-200"
                   style={{ background: "#111111", borderColor: "#1a1a1a" }}
                   onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.5)"}
                   onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a"}>
                <div className="text-3xl mb-4">{icon}</div>
                <div className="font-semibold text-white mb-3">{title}</div>
                <div className="text-sm leading-relaxed" style={{ color: "#888888" }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          API Viewer
      ════════════════════════════════ */}
      <section id="api" className="px-6 py-20 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>API Reference</SectionLabel>
            <h2 className="text-xl font-bold"
                style={{ fontFamily: "var(--font-geist-mono)", color: "#3b82f6" }}>
              POST /api/kyc/verify
            </h2>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit"
               style={{ background: "#111111", border: "1px solid #1a1a1a" }}>
            {(["request", "response", "agent"] as Tab[]).map((id) => {
              const label = id === "request" ? "リクエスト" : id === "response" ? "レスポンス" : "AI Agent SDK";
              return (
                <button key={id} onClick={() => setTab(id)}
                        className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                        style={{
                          background: tab === id ? "#3b82f6" : "transparent",
                          color: tab === id ? "#ffffff" : "#888888",
                          fontFamily: "var(--font-geist-mono)",
                          cursor: "pointer", border: "none",
                        }}>
                  {label}
                </button>
              );
            })}
          </div>

          <CodeBlock lines={tabLines[tab]} />

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mt-5">
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: "#0a1a0a", color: "#00ff87",
                           border: "1px solid rgba(0,255,135,0.15)",
                           fontFamily: "var(--font-geist-mono)" }}>
              $1.00 USDC on Base — Japan Corporate
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs"
                  style={{ background: "#0a0f1a", color: "#3b82f6",
                           border: "1px solid rgba(59,130,246,0.15)",
                           fontFamily: "var(--font-geist-mono)" }}>
              USDC on Base
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          Protocol Stack
      ════════════════════════════════ */}
      <section className="px-6 py-20 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Protocol Stack</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold"
                style={{ letterSpacing: "-0.02em" }}>
              2つのプロトコルが解決する問題
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 border transition-colors duration-200"
                 style={{ background: "#111111", borderColor: "#1a1a1a" }}
                 onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.5)"}
                 onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a"}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: "#16102a", color: "#c4b5fd" }}>
                  x402
                </span>
                <span className="font-semibold text-white text-sm">
                  エージェントがどうやって支払うか
                </span>
              </div>
              {[
                "APIキー不要・サブスク不要",
                "使った分だけ $1〜$3 USDC on Base",
                "HTTP 402 で支払い情報を自動交換",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start py-3 border-b last:border-0"
                     style={{ borderColor: "#1a1a1a" }}>
                  <span style={{ color: "#c4b5fd", flexShrink: 0 }}>→</span>
                  <span className="text-sm" style={{ color: "#888888" }}>{item}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-6 border transition-colors duration-200"
                 style={{ background: "#111111", borderColor: "#1a1a1a" }}
                 onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.5)"}
                 onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a"}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: "#081a10", color: "#00ff87" }}>
                  World AgentKit
                </span>
                <span className="font-semibold text-white text-sm">
                  誰の代わりに動いているか
                </span>
              </div>
              {[
                "World IDで人間性を暗号学的に証明",
                "シビル攻撃（多数エージェント）を防止",
                "nullifier_hashで1人1アクションを強制",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start py-3 border-b last:border-0"
                     style={{ borderColor: "#1a1a1a" }}>
                  <span style={{ color: "#00ff87", flexShrink: 0 }}>→</span>
                  <span className="text-sm" style={{ color: "#888888" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          Footer
      ════════════════════════════════ */}
      <footer className="px-6 py-14 border-t text-center" style={{ borderColor: "#1a1a1a" }}>
        <p className="text-sm mb-5"
           style={{ color: "#555555", fontFamily: "var(--font-geist-mono)" }}>
          Built with World AgentKit + x402 Protocol
        </p>
        <div className="flex items-center justify-center gap-6 mb-8">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
             className="text-sm transition-colors duration-200"
             style={{ color: "#555555" }}
             onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
             onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#555555")}>
            GitHub →
          </a>
          <span className="px-3 py-1.5 rounded-lg text-xs"
                style={{ background: "#111111", border: "1px solid #1a1a1a",
                         color: "#555555", fontFamily: "var(--font-geist-mono)" }}>
            x402scan: coming soon
          </span>
        </div>
        <p className="text-xs max-w-md mx-auto" style={{ color: "#333333" }}>
          本サービスは照合・スクリーニング結果を提供するものであり、法的判断や審査結果を保証するものではありません。
        </p>
      </footer>
    </div>
  );
}
