"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  Loader2,
  Play,
  RotateCcw,
  Star,
} from "lucide-react";

const CASES = [
  {
    id: 1,
    topic: "神的經綸",
    text: "神的經綸乃是要將祂自己分賜到我們裏面，作我們的生命和一切，使我們在生命裏長大，被建造成為基督的身體，終極完成新耶路撒冷。",
  },
  {
    id: 2,
    topic: "那靈",
    text: "今天我們所享受的那靈，乃是經過過程並終極完成之三一神的實際，作我們每天主觀的供應。",
  },
  {
    id: 3,
    topic: "調和的靈",
    text: "基督徒生活的關鍵，乃是轉向我們調和的靈，在靈裏接觸主、享受主並活主。",
  },
  {
    id: 4,
    topic: "生命的長大",
    text: "生命的長大不是外面的改良，乃是基督在我們裏面加多，使我們在生命裏被變化並成熟。",
  },
  {
    id: 5,
    topic: "建造基督的身體",
    text: "我們的事奉不該只完成工作，乃該供應基督，使聖徒被成全，為著建造基督的身體。",
  },
  {
    id: 6,
    topic: "新婦的豫備",
    text: "主回來以前，召會需要在生命裏成熟，被豫備成為基督的新婦，使她在生命、性情和彰顯上與基督相配。",
  },
  {
    id: 7,
    topic: "得勝者",
    text: "得勝者不是一班特別的人，乃是在召會荒涼中回應主呼召、愛主並忠信站住的人。",
  },
  {
    id: 8,
    topic: "喫喝享受主",
    text: "我們每天都需要藉著禱告、呼求主名並禱讀主話來喫喝享受主，使基督實際成為我們裏面的供應。",
  },
  {
    id: 9,
    topic: "申言",
    text: "申言乃是為主說話並說出主，也把主供應到人裏面，使召會得著建造。",
  },
  {
    id: 10,
    topic: "晨興與聚會交通",
    text: "我們在早晨藉著晨興被主復興，並將所享受的基督帶到聚會中彼此供應、彼此建造。",
  },
];

type Result = {
  translation?: string;
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
};

type Row = {
  luna?: Result;
  sol?: Result;
  lunaScore?: number;
  solScore?: number;
};

export default function BenchmarkPage() {
  const [rows, setRows] = useState<Record<number, Row>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [runningAll, setRunningAll] = useState(false);

  const summary = useMemo(() => {
    let lunaCost = 0;
    let solCost = 0;
    let lunaScore = 0;
    let solScore = 0;
    let lunaCount = 0;
    let solCount = 0;

    Object.values(rows).forEach((row) => {
      lunaCost += row.luna?.usage?.estimatedCostUsd ?? 0;
      solCost += row.sol?.usage?.estimatedCostUsd ?? 0;
      if (row.lunaScore) {
        lunaScore += row.lunaScore;
        lunaCount += 1;
      }
      if (row.solScore) {
        solScore += row.solScore;
        solCount += 1;
      }
    });

    return {
      lunaCost,
      solCost,
      lunaAvg: lunaCount ? lunaScore / lunaCount : 0,
      solAvg: solCount ? solScore / solCount : 0,
    };
  }, [rows]);

  async function callModel(text: string, model: string): Promise<Result> {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          targetLanguage: "英文",
          mode: "召會用語優先",
          model,
        }),
      });
      const data = await response.json();
      if (!response.ok) return { error: data.error || "翻譯失敗" };
      return data;
    } catch {
      return { error: "無法連線到翻譯服務" };
    }
  }

  async function runCase(id: number, text: string) {
    setLoadingId(id);
    const [luna, sol] = await Promise.all([
      callModel(text, "gpt-6-luna"),
      callModel(text, "gpt-6.1-sol"),
    ]);
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], luna, sol } }));
    setLoadingId(null);
  }

  async function runAll() {
    setRunningAll(true);
    for (const item of CASES) {
      setLoadingId(item.id);
      const [luna, sol] = await Promise.all([
        callModel(item.text, "gpt-6-luna"),
        callModel(item.text, "gpt-6.1-sol"),
      ]);
      setRows((prev) => ({ ...prev, [item.id]: { ...prev[item.id], luna, sol } }));
    }
    setLoadingId(null);
    setRunningAll(false);
  }

  function score(id: number, model: "lunaScore" | "solScore", value: number) {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], [model]: value },
    }));
  }

  function reset() {
    setRows({});
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="/translate" className="inline-flex items-center gap-2 font-bold text-slate-700 hover:text-blue-700">
            <ArrowLeft size={18} /> 回翻譯工作台
          </a>
          <div className="text-sm font-bold text-slate-500">Luna vs Sol Benchmark</div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
              <FlaskConical size={16} /> 10 題召會翻譯測試集
            </div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">Luna / Sol 品質與成本比較</h1>
            <p className="mt-3 max-w-3xl leading-8 text-slate-600">
              每題同時翻成英文，觀察召會術語、語氣、自然度與成本。每個模型可人工給 1–5 分，最後比較平均分與總成本。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={runAll}
              disabled={runningAll}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-40"
            >
              {runningAll ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Play className="mr-2" size={18} />}
              {runningAll ? "測試進行中…" : "一次跑完 10 題"}
            </button>
            <button onClick={reset} className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700">
              <RotateCcw className="mr-2" size={17} /> 重設
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <SummaryCard label="Luna 總成本" value={`$${summary.lunaCost.toFixed(6)}`} />
          <SummaryCard label="Sol 總成本" value={`$${summary.solCost.toFixed(6)}`} />
          <SummaryCard label="Luna 平均分" value={summary.lunaAvg ? summary.lunaAvg.toFixed(2) : "—"} />
          <SummaryCard label="Sol 平均分" value={summary.solAvg ? summary.solAvg.toFixed(2) : "—"} />
        </div>

        <div className="grid gap-6">
          {CASES.map((item) => {
            const row = rows[item.id] || {};
            const busy = loadingId === item.id;
            return (
              <article key={item.id} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-4xl">
                    <div className="text-sm font-black text-blue-700">#{item.id}｜{item.topic}</div>
                    <p className="mt-2 text-lg leading-8 text-slate-800">{item.text}</p>
                  </div>
                  <button
                    onClick={() => runCase(item.id, item.text)}
                    disabled={busy || runningAll}
                    className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700 disabled:opacity-40"
                  >
                    {busy ? <Loader2 className="mr-2 animate-spin" size={17} /> : <Play className="mr-2" size={17} />}
                    {busy ? "測試中" : "測這一題"}
                  </button>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <ModelPanel
                    title="GPT-6 Luna"
                    accent="text-cyan-600"
                    result={row.luna}
                    scoreValue={row.lunaScore}
                    onScore={(value) => score(item.id, "lunaScore", value)}
                  />
                  <ModelPanel
                    title="GPT-6.1 Sol"
                    accent="text-indigo-600"
                    result={row.sol}
                    scoreValue={row.solScore}
                    onScore={(value) => score(item.id, "solScore", value)}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function ModelPanel({
  title,
  accent,
  result,
  scoreValue,
  onScore,
}: {
  title: string;
  accent: string;
  result?: Result;
  scoreValue?: number;
  onScore: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl bg-slate-950 p-5 text-white">
      <div className={`font-black ${accent}`}>{title}</div>
      <div className="mt-4 min-h-[150px] whitespace-pre-wrap rounded-2xl bg-white/10 p-4 leading-8 text-slate-100">
        {result?.error ? <span className="text-red-300">{result.error}</span> : result?.translation || "尚未測試"}
      </div>

      {result?.usage && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          <Mini label="Input" value={result.usage.inputTokens.toLocaleString()} />
          <Mini label="Output" value={result.usage.outputTokens.toLocaleString()} />
          <Mini label="Total" value={result.usage.totalTokens.toLocaleString()} />
          <Mini label="USD" value={`$${result.usage.estimatedCostUsd.toFixed(6)}`} />
        </div>
      )}

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="mb-2 text-sm font-bold text-slate-300">人工評分</div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onScore(n)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                scoreValue === n
                  ? "border-amber-300 bg-amber-300 text-slate-950"
                  : "border-white/20 bg-white/5 text-white hover:bg-white/10"
              }`}
              title={`${n} 分`}
            >
              {scoreValue === n ? <CheckCircle2 size={16} /> : <Star size={15} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-2">
      <div className="text-[11px] font-bold text-slate-400">{label}</div>
      <div className="mt-1 font-black">{value}</div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-bold text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-black">{value}</div>
    </div>
  );
}
