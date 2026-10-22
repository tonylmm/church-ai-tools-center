"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  GitCompareArrows,
  Languages,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const TARGET_LANGUAGES = [
  "英文",
  "日文",
  "韓文",
  "德文",
  "法文",
  "印尼文",
  "西班牙文",
];

const MODES = [
  "召會用語優先",
  "聚會朗讀自然版",
  "書報語氣精準版",
  "福音朋友易懂版",
];

const MODELS = [
  {
    id: "gpt-6-luna",
    name: "GPT-6 Luna",
    tag: "低成本・大量翻譯",
  },
  {
    id: "gpt-6.1-sol",
    name: "GPT-6.1 Sol",
    tag: "高品質・校對",
  },
];

type TranslateResult = {
  translation: string;
  model: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
  error?: string;
};

type CompareResults = {
  luna: TranslateResult | null;
  sol: TranslateResult | null;
};

export default function TranslatePage() {
  const [text, setText] = useState(
    "弟兄姊妹們，我們今天要操練在靈裏享受主，並在召會生活中彼此建造。"
  );
  const [targetLanguage, setTargetLanguage] = useState("英文");
  const [mode, setMode] = useState("召會用語優先");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompareResults>({ luna: null, sol: null });
  const [copied, setCopied] = useState<string | null>(null);

  const charCount = text.length;
  const remaining = 5000 - charCount;
  const canSubmit = text.trim().length > 0 && charCount <= 5000 && !loading;

  async function callTranslate(model: string): Promise<TranslateResult> {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage, mode, model }),
      });
      const data = (await response.json()) as TranslateResult;
      if (!response.ok) {
        return {
          translation: "",
          model,
          error: data.error || "翻譯失敗。",
        };
      }
      return data;
    } catch {
      return {
        translation: "",
        model,
        error: "無法連線到翻譯服務。",
      };
    }
  }

  async function compareBoth() {
    if (!canSubmit) return;
    setLoading(true);
    setResults({ luna: null, sol: null });

    const [luna, sol] = await Promise.all([
      callTranslate("gpt-6-luna"),
      callTranslate("gpt-6.1-sol"),
    ]);

    setResults({ luna, sol });
    setLoading(false);
  }

  async function copyResult(key: "luna" | "sol") {
    const result = results[key];
    if (!result?.translation) return;
    await navigator.clipboard.writeText(result.translation);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  }

  function reset() {
    setText("");
    setResults({ luna: null, sol: null });
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="/" className="inline-flex items-center gap-2 font-bold text-slate-700 hover:text-blue-700">
            <ArrowLeft size={18} /> 回工具中心
          </a>
          <div className="text-sm font-bold text-slate-500">Luna / Sol 品質比較測試</div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            <Sparkles size={16} /> 雙模型同文比較
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">召會翻譯品質測試台</h1>
          <p className="mt-3 max-w-3xl leading-8 text-slate-600">
            同一段文字同時交給 GPT-6 Luna 與 GPT-6.1 Sol，直接比較翻譯品質、token 用量與估算成本。
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              目標語言
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100"
              >
                {TARGET_LANGUAGES.map((lang) => <option key={lang}>{lang}</option>)}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-bold text-slate-700">
              翻譯模式
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100"
              >
                {MODES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700">
              <span>原文</span>
              <span className={remaining < 0 ? "text-red-600" : "text-slate-400"}>
                {charCount.toLocaleString()} / 5,000 字
              </span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="貼上要翻譯的內容…"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 leading-8 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {remaining < 0 && (
            <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
              已超過單次 5,000 字限制，請縮短內容後再送出。
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={!canSubmit}
              onClick={compareBoth}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? <Loader2 className="mr-2 animate-spin" size={18} /> : <GitCompareArrows className="mr-2" size={18} />}
              {loading ? "兩個模型翻譯中…" : "同時比較 Luna 與 Sol"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700"
            >
              <RotateCcw className="mr-2" size={17} /> 清除
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ResultCard
            title="GPT-6 Luna"
            subtitle="低成本・大量翻譯"
            accent="cyan"
            result={results.luna}
            copied={copied === "luna"}
            onCopy={() => copyResult("luna")}
            targetLanguage={targetLanguage}
          />
          <ResultCard
            title="GPT-6.1 Sol"
            subtitle="高品質・重要文本校對"
            accent="indigo"
            result={results.sol}
            copied={copied === "sol"}
            onCopy={() => copyResult("sol")}
            targetLanguage={targetLanguage}
          />
        </div>

        {(results.luna?.usage || results.sol?.usage) && (
          <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">成本比較</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <CostSummary name="Luna" result={results.luna} />
              <CostSummary name="Sol" result={results.sol} />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function ResultCard({
  title,
  subtitle,
  accent,
  result,
  copied,
  onCopy,
  targetLanguage,
}: {
  title: string;
  subtitle: string;
  accent: "cyan" | "indigo";
  result: TranslateResult | null;
  copied: boolean;
  onCopy: () => void;
  targetLanguage: string;
}) {
  const badge = accent === "cyan" ? "text-cyan-300" : "text-indigo-300";

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`text-sm font-bold ${badge}`}>{subtitle}</div>
          <h2 className="mt-1 text-2xl font-black">{title}</h2>
          <div className="mt-1 text-sm text-slate-400">目標語言：{targetLanguage}</div>
        </div>
        {result?.translation && (
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-950"
          >
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copied ? "已複製" : "複製"}
          </button>
        )}
      </div>

      <div className="mt-5 min-h-[260px] whitespace-pre-wrap rounded-3xl bg-white/10 p-5 leading-8 text-slate-100">
        {result?.error
          ? <span className="text-red-300">{result.error}</span>
          : result?.translation || "翻譯結果會顯示在這裡。"}
      </div>

      {result?.usage && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Metric label="Input" value={result.usage.inputTokens.toLocaleString()} />
          <Metric label="Output" value={result.usage.outputTokens.toLocaleString()} />
          <Metric label="Total" value={result.usage.totalTokens.toLocaleString()} />
          <Metric label="估算 USD" value={`$${result.usage.estimatedCostUsd.toFixed(6)}`} />
        </div>
      )}
    </div>
  );
}

function CostSummary({ name, result }: { name: string; result: TranslateResult | null }) {
  if (!result?.usage) {
    return <div className="rounded-2xl bg-slate-50 p-4 text-slate-500">{name} 尚無資料</div>;
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="font-black">{name}</div>
      <div className="mt-2 text-sm leading-7 text-slate-600">
        {result.usage.totalTokens.toLocaleString()} tokens<br />
        約 US${result.usage.estimatedCostUsd.toFixed(6)}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <div className="text-xs font-bold text-slate-400">{label}</div>
      <div className="mt-1 font-black text-white">{value}</div>
    </div>
  );
}
