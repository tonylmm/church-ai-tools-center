"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
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
    desc: "適合日常翻譯與大量文字處理。",
  },
  {
    id: "gpt-6.1-sol",
    name: "GPT-6.1 Sol",
    tag: "高品質・校對",
    desc: "適合重要信息、書報與較難文本。",
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
  meta?: {
    characters: number;
    targetLanguage: string;
    mode: string;
  };
  error?: string;
};

export default function TranslatePage() {
  const [text, setText] = useState(
    "弟兄姊妹們，我們今天要操練在靈裏享受主，並在召會生活中彼此建造。"
  );
  const [targetLanguage, setTargetLanguage] = useState("英文");
  const [mode, setMode] = useState("召會用語優先");
  const [model, setModel] = useState("gpt-6-luna");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslateResult | null>(null);
  const [copied, setCopied] = useState(false);

  const charCount = text.length;
  const remaining = 5000 - charCount;
  const canSubmit = text.trim().length > 0 && charCount <= 5000 && !loading;

  const selectedModel = useMemo(
    () => MODELS.find((item) => item.id === model) ?? MODELS[0],
    [model]
  );

  async function translate() {
    if (!canSubmit) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage, mode, model }),
      });

      const data = (await response.json()) as TranslateResult;
      if (!response.ok) {
        setResult({ translation: "", model, error: data.error || "翻譯失敗。" });
        return;
      }
      setResult(data);
    } catch {
      setResult({ translation: "", model, error: "無法連線到翻譯服務。" });
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result?.translation) return;
    await navigator.clipboard.writeText(result.translation);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function reset() {
    setText("");
    setResult(null);
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="/" className="inline-flex items-center gap-2 font-bold text-slate-700 hover:text-blue-700">
            <ArrowLeft size={18} /> 回工具中心
          </a>
          <div className="text-sm font-bold text-slate-500">召會 AI 即時翻譯 Beta</div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            <Sparkles size={16} /> OpenAI API 站內翻譯
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">召會翻譯工作台</h1>
          <p className="mt-3 max-w-3xl leading-8 text-slate-600">
            直接在網站內翻譯，不再依賴 GPTs 連結。單次最多 5,000 字，可比較 Luna 與 Sol 的品質與實際 token 成本。
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
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
                rows={14}
                placeholder="貼上要翻譯的內容…"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 leading-8 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="mt-5">
              <div className="mb-3 text-sm font-bold text-slate-700">選擇模型</div>
              <div className="grid gap-3 md:grid-cols-2">
                {MODELS.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setModel(item.id)}
                    className={`rounded-3xl border p-4 text-left transition ${
                      model === item.id
                        ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="font-black">{item.name}</div>
                    <div className="mt-1 text-xs font-bold text-blue-700">{item.tag}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
                  </button>
                ))}
              </div>
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
                onClick={translate}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Languages className="mr-2" size={18} />}
                {loading ? "翻譯中…" : `使用 ${selectedModel.name} 翻譯`}
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

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-cyan-300">翻譯結果</div>
                <h2 className="mt-1 text-2xl font-black">{targetLanguage}</h2>
              </div>
              {result?.translation && (
                <button
                  type="button"
                  onClick={copyResult}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-950"
                >
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {copied ? "已複製" : "複製"}
                </button>
              )}
            </div>

            <div className="mt-5 min-h-[320px] whitespace-pre-wrap rounded-3xl bg-white/10 p-5 leading-8 text-slate-100">
              {result?.error
                ? <span className="text-red-300">{result.error}</span>
                : result?.translation || "翻譯結果會顯示在這裡。"}
            </div>

            {result?.usage && (
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Metric label="Input" value={result.usage.inputTokens.toLocaleString()} />
                <Metric label="Output" value={result.usage.outputTokens.toLocaleString()} />
                <Metric label="Total" value={result.usage.totalTokens.toLocaleString()} />
                <Metric label="估算 USD" value={`$${result.usage.estimatedCostUsd.toFixed(6)}`} />
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
              目前內建第一批召會術語。涉及完整聖經經文時，若尚未建立可核對的恢復本經文資料庫，系統會優先維持恢復本術語與語氣，但不假裝逐字保證官方經文。
            </div>
          </div>
        </div>
      </section>
    </main>
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
