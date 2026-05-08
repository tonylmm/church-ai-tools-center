"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clipboard,
  Copy,
  Database,
  FileText,
  Globe2,
  HelpCircle,
  Languages,
  Layers3,
  LineChart,
  ListChecks,
  LockKeyhole,
  MessageCircle,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UploadCloud,
  Wand2,
} from "lucide-react";

const tools = [
  {
    id: "general",
    title: "召會通用翻譯及對話助手",
    subtitle: "翻譯＋聖經書報對話",
    desc: "適合晨興聖言、綱要、信息摘要、聖經主題與多語對話練習。",
    link: "https://reurl.cc/GnbQ4A",
    prompt:
      "請作為主恢復中的召會翻譯與對話助手，依據召會用語、聖經恢復本與書報語境，協助我進行準確、自然、可聚會使用的翻譯與對話練習。",
    category: "推薦入口",
  },
  {
    id: "zh-en",
    title: "中英助手",
    subtitle: "中文 ⇄ 英文",
    desc: "適合交通稿、見證、晨興分享、聚會通知與服事訊息。",
    link: "https://reurl.cc/M6MMbX",
    prompt:
      "請作為召會用語優先的中英翻譯助手。若遇到召會、聖經、晨興、申言、聚會等語境，請優先採用主恢復中合適的英文用語。",
    category: "即時翻譯",
  },
  {
    id: "zh-fr",
    title: "中英法助手",
    subtitle: "中文／英文／法文",
    desc: "適合歐洲語系服事、福音材料與簡短交通內容。",
    link: "https://reurl.cc/WAvgjD",
    prompt:
      "請協助中文、英文、法文之間的召會語境翻譯，語氣自然、溫和、適合聖徒交通。",
    category: "即時翻譯",
  },
  {
    id: "zh-de",
    title: "中英德助手",
    subtitle: "中文／英文／德文",
    desc: "適合德語聖徒交通、福音接觸與信息摘要翻譯。",
    link: "https://reurl.cc/qnr80p",
    prompt:
      "請協助中文、英文、德文之間的召會語境翻譯，保留主恢復用語的準確性。",
    category: "即時翻譯",
  },
  {
    id: "zh-ja",
    title: "中英日助手",
    subtitle: "中文／英文／日文",
    desc: "適合日語福音接觸、聚會交通、短訊息與晨興內容。",
    link: "https://reurl.cc/zp6LvN",
    prompt:
      "請協助中文、英文、日文之間的召會語境翻譯，語氣自然、可朗讀、適合聚會使用。",
    category: "即時翻譯",
  },
  {
    id: "zh-ko",
    title: "中英韓助手",
    subtitle: "中文／英文／韓文",
    desc: "適合韓語聖徒交通、福音訊息與聚會材料翻譯。",
    link: "https://reurl.cc/V04g9A",
    prompt:
      "請協助中文、英文、韓文之間的召會語境翻譯，重視語氣自然與屬靈用語準確。",
    category: "即時翻譯",
  },
  {
    id: "zh-id",
    title: "中英印尼助手",
    subtitle: "中文／英文／印尼文",
    desc: "適合印尼語聖徒服事、生活照顧與聚會交通。",
    link: "https://reurl.cc/qnKaa3",
    prompt:
      "請協助中文、英文、印尼文之間的召會語境翻譯，語氣清楚、溫柔、適合聖徒交通。",
    category: "即時翻譯",
  },
  {
    id: "zh-es",
    title: "中英西班牙文助手",
    subtitle: "中文／英文／西文",
    desc: "適合西語福音材料、簡短交通與多語服事使用。",
    link: "https://reurl.cc/V02dq5",
    prompt:
      "請協助中文、英文、西班牙文之間的召會語境翻譯，保留主恢復用語與自然語氣。",
    category: "即時翻譯",
  },
];

const glossaryExamples = [
  {
    zh: "召會",
    en: "church",
    note: "主恢復中固定用語，避免一律翻作一般制度化教會。",
  },
  {
    zh: "那靈",
    en: "the Spirit",
    note: "保留特定屬靈語境，不簡化為一般 spirit。",
  },
  {
    zh: "神的經綸",
    en: "God's economy",
    note: "不可翻成一般經濟學意義。",
  },
  {
    zh: "申言",
    en: "prophesying",
    note: "在聚會中為主說話並說出主。",
  },
  {
    zh: "晨興",
    en: "morning revival",
    note: "適用於晨興聖言與晨晨復興語境。",
  },
];

const roadmap = [
  {
    phase: "Phase 1",
    title: "入口與使用體驗重整",
    items: [
      "首頁資訊架構重整",
      "Chrome 桌面優先測試",
      "iPhone / LINE 教學頁",
      "每張工具卡加入複製提示詞",
    ],
  },
  {
    phase: "Phase 2",
    title: "站內單筆翻譯",
    items: [
      "/translate 工作台",
      "OpenAI API Route",
      "術語庫 JSON",
      "翻譯設定檔",
    ],
  },
  {
    phase: "Phase 3",
    title: "大量翻譯 Beta",
    items: [
      "貼上長文",
      "自動分段",
      "佇列任務",
      "下載 TXT / CSV / DOCX",
    ],
  },
  {
    phase: "Phase 4",
    title: "資料庫與後台",
    items: [
      "術語庫管理",
      "任務紀錄",
      "成本統計",
      "權限與限流",
    ],
  },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ChurchAIToolsCenterPro() {
  const [query, setQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState(tools[0]);
  const [copied, setCopied] = useState<string | null>(null);
  const [sourceText, setSourceText] = useState(
    "弟兄姊妹們，我們今天要操練在靈裏享受主，並在召會生活中彼此建造。"
  );
  const [targetLang, setTargetLang] = useState("英文");
  const [mode, setMode] = useState("召會用語優先");

  const filteredTools = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return tools;

    return tools.filter((tool) =>
      `${tool.title} ${tool.subtitle} ${tool.desc} ${tool.category}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [query]);

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      alert("複製失敗，請改用手動選取文字複製。");
    }
  }

  const previewPrompt = `請將以下內容翻譯成${targetLang}。
翻譯模式：${mode}
要求：保留主恢復中召會用語；若涉及聖經經文，請按恢復本聖經語感處理；語氣需自然、清楚、適合聚會或服事使用。

原文：
${sourceText}`;

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 text-white shadow-lg">
              <BookOpen size={22} />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-300 ring-2 ring-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide text-slate-500">
                Church AI Tools Center
              </div>
              <div className="font-black tracking-tight">
                召會 AI 工具中心 v1.0 Pro
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
            <a href="#tools" className="hover:text-blue-700">
              工具入口
            </a>
            <a href="#bulk" className="hover:text-blue-700">
              大量翻譯
            </a>
            <a href="#glossary" className="hover:text-blue-700">
              術語庫
            </a>
            <a href="#iphone" className="hover:text-blue-700">
              iPhone教學
            </a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),radial-gradient(circle_at_top_right,#e0e7ff,transparent_35%),linear-gradient(to_bottom,#ffffff,#f6f7fb)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:px-6 lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-800 shadow-sm">
              <Sparkles size={16} />
              v1.0 Pro 架構：站內翻譯為主，ChatGPT App 為輔助入口
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              多語翻譯、召會術語、
              <span className="block bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                大量翻譯工作台
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">
              將原本的「GPT 連結清單」升級為真正可工作的工具中心：
              Chrome 桌面優先測試，站內完成翻譯；iPhone 與 LINE
              使用者則提供清楚的教學與備援流程。
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#bulk"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                進入大量翻譯規劃 <ArrowRight className="ml-2" size={18} />
              </a>

              <a
                href="#tools"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                查看翻譯助手
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                [
                  MonitorSmartphone,
                  "Chrome優先",
                  "以桌面 Chrome 作為主要測試瀏覽器",
                ],
                [
                  Database,
                  "術語庫",
                  "召會用語與恢復本語感一致化",
                ],
                [
                  ShieldCheck,
                  "安全後端",
                  "API Key 僅放伺服器端",
                ],
              ].map(([Icon, title, desc]) => {
                const TheIcon = Icon as typeof MonitorSmartphone;

                return (
                  <div
                    key={String(title)}
                    className="rounded-3xl border border-white bg-white/75 p-4 shadow-sm backdrop-blur"
                  >
                    <TheIcon className="mb-3 text-blue-700" size={24} />
                    <div className="font-bold">{title as string}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {desc as string}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-300">Pro 工作流</div>
                  <h2 className="mt-1 text-2xl font-black">
                    從連結入口升級為翻譯平台
                  </h2>
                </div>
                <Wand2 className="text-cyan-300" size={34} />
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  [
                    "1",
                    "站內單筆翻譯",
                    "短文、交通稿、聚會訊息即時處理",
                  ],
                  [
                    "2",
                    "術語庫套用",
                    "召會、那靈、神的經綸等用語一致",
                  ],
                  [
                    "3",
                    "大量翻譯任務",
                    "長文／檔案分段、排隊、輸出下載",
                  ],
                  [
                    "4",
                    "ChatGPT App 備援",
                    "iPhone 使用者以教學頁＋複製提示詞處理",
                  ],
                ].map(([num, title, desc]) => (
                  <div key={num} className="flex gap-3 rounded-2xl bg-white/10 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 font-black text-slate-950">
                      {num}
                    </div>
                    <div>
                      <div className="font-bold">{title}</div>
                      <div className="text-sm leading-6 text-slate-300">
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-700">
              <Layers3 size={16} />
              工具入口
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              翻譯助手不再只是外部連結
            </h2>
            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
              每張卡片都提供：站內使用策略、外部助手連結、複製提示詞與
              iPhone 備援流程。
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋：日文、印尼、通用…"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none ring-blue-100 transition focus:ring-4"
            />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {filteredTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool)}
                className={classNames(
                  "group rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg",
                  selectedTool.id === tool.id
                    ? "border-blue-400 ring-4 ring-blue-100"
                    : "border-slate-200"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700">
                      <Languages size={23} />
                    </div>
                    <div>
                      <h3 className="font-black">{tool.title}</h3>
                      <p className="text-sm font-medium text-slate-500">
                        {tool.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {tool.category}
                  </span>
                </div>

                <p className="mt-4 leading-7 text-slate-600">{tool.desc}</p>
              </button>
            ))}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  目前選擇
                </div>
                <h3 className="text-2xl font-black">{selectedTool.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">
                  {selectedTool.desc}
                </p>
              </div>

              <a
                href={selectedTool.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-blue-800"
              >
                開啟原 GPT <ArrowRight className="ml-2" size={17} />
              </a>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="mb-3 flex items-center gap-2 font-black">
                  <MonitorSmartphone size={20} />
                  Chrome 桌面建議
                </div>
                <p className="leading-7 text-slate-600">
                  在 Chrome 中，建議優先使用站內翻譯工作台；外部 GPT
                  連結只作為補充入口，避免 iPhone 跳轉不穩。
                </p>
              </div>

              <div className="rounded-3xl bg-amber-50 p-5">
                <div className="mb-3 flex items-center gap-2 font-black">
                  <Smartphone size={20} />
                  iPhone 備援策略
                </div>
                <p className="leading-7 text-slate-600">
                  不承諾一定開啟 ChatGPT App；提供教學頁、複製提示詞、手動貼到
                  App 的穩定流程。
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="font-black">可複製提示詞</div>
                <button
                  onClick={() => copyText(selectedTool.prompt, selectedTool.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-100"
                >
                  {copied === selectedTool.id ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                  {copied === selectedTool.id ? "已複製" : "複製"}
                </button>
              </div>

              <p className="whitespace-pre-wrap leading-8 text-slate-200">
                {selectedTool.prompt}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="bulk" className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-700">
                <UploadCloud size={16} />
                大量翻譯 Beta 規劃
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                把長文與檔案翻譯留在網站內完成
              </h2>

              <p className="mt-3 leading-8 text-slate-600">
                未來接 OpenAI API 後，這裡會成為核心功能：
                分段、套用術語庫、排隊、批次翻譯、輸出下載。現在先以 Chrome
                可測試的前端原型呈現流程。
              </p>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-1 text-blue-700" size={22} />
                <div>
                  <div className="font-black text-blue-950">
                    API Key 不放前端
                  </div>
                  <p className="mt-1 leading-7 text-blue-900/75">
                    正式版需透過 Next.js API Route 呼叫 OpenAI，並把
                    OPENAI_API_KEY 放在 Vercel 環境變數，不能寫在瀏覽器程式碼中。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  目標語言
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <option>英文</option>
                    <option>日文</option>
                    <option>韓文</option>
                    <option>德文</option>
                    <option>法文</option>
                    <option>印尼文</option>
                    <option>西班牙文</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  翻譯模式
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <option>召會用語優先</option>
                    <option>聚會朗讀自然版</option>
                    <option>書報語氣精準版</option>
                    <option>福音朋友易懂版</option>
                  </select>
                </label>
              </div>

              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
                貼上要翻譯的內容
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  rows={9}
                  className="rounded-3xl border border-slate-200 bg-white p-4 leading-8 outline-none focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => copyText(previewPrompt, "bulk-prompt")}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-blue-800"
                >
                  {copied === "bulk-prompt" ? (
                    <CheckCircle2 className="mr-2" size={18} />
                  ) : (
                    <Clipboard className="mr-2" size={18} />
                  )}
                  {copied === "bulk-prompt"
                    ? "已複製翻譯提示詞"
                    : "複製測試提示詞"}
                </button>

                <button className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700">
                  <FileText className="mr-2" size={18} />
                  檔案上傳規劃中
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-xl font-black">
                <ListChecks size={22} />
                正式版處理流程
              </h3>

              <div className="mt-5 grid gap-3">
                {[
                  [
                    "01",
                    "文字切段",
                    "依段落、標點與 token 長度切成可翻譯單位",
                  ],
                  [
                    "02",
                    "術語比對",
                    "先掃描召會用語、經文、書報固定詞",
                  ],
                  [
                    "03",
                    "API 翻譯",
                    "短文走 Responses API；大量任務可走 Batch API",
                  ],
                  [
                    "04",
                    "一致化檢查",
                    "統一術語、語氣、稱謂與段落格式",
                  ],
                  [
                    "05",
                    "下載輸出",
                    "提供 TXT、CSV、DOCX 等格式",
                  ],
                ].map(([num, title, desc]) => (
                  <div key={num} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                      {num}
                    </div>
                    <div>
                      <div className="font-black">{title}</div>
                      <div className="text-sm leading-6 text-slate-600">
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="glossary" className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="mb-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-700">
              <Database size={16} />
              術語資料庫
            </div>

            <h2 className="text-3xl font-black tracking-tight">
              準確度的核心不是更漂亮的卡片，而是術語一致
            </h2>

            <p className="mt-3 leading-8 text-slate-600">
              建議先用 JSON / CSV 建立最小術語庫，正式版再升級到資料庫，
              讓翻譯可追蹤、可維護、可調整。
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="font-black">建議資料表</div>
            <p className="mt-2 leading-7 text-slate-600">
              GlossaryTerm：sourceTerm、targetTerm、languagePair、domain、note、status、updatedAt。
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {glossaryExamples.map((term) => (
            <div
              key={term.zh}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="text-sm font-bold text-slate-500">中文</div>
              <div className="mt-1 text-xl font-black">{term.zh}</div>

              <div className="mt-4 text-sm font-bold text-slate-500">
                英文建議
              </div>
              <div className="mt-1 font-black text-blue-700">{term.en}</div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {term.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="iphone" className="bg-slate-950 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-cyan-300">
                <Smartphone size={16} />
                iPhone / LINE / ChatGPT App 策略
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                不再承諾「一定跳 App」
              </h2>

              <p className="mt-4 leading-8 text-slate-300">
                iPhone 上從網站強制開啟 ChatGPT App 並不穩定，因此 v1.0 Pro
                把 App 入口降級為輔助流程：教學頁、複製提示詞、手動貼到
                App。Chrome 桌面與站內翻譯才是主流程。
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                [
                  "Chrome 桌面",
                  "直接用站內翻譯工作台，不依賴外部 GPT 跳轉。",
                ],
                [
                  "iPhone Safari",
                  "顯示教學頁與 Smart App Banner；不保證指定 GPT 深層開啟。",
                ],
                [
                  "LINE 內建瀏覽器",
                  "提示改用外部瀏覽器，並提供複製提示詞備援。",
                ],
                [
                  "ChatGPT App",
                  "作為進階使用者的輔助工具，不作為主要功能依賴。",
                ],
              ].map(([title, desc]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/10 p-5"
                >
                  <div className="font-black text-cyan-200">{title}</div>
                  <p className="mt-2 leading-7 text-slate-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-700">
            <LineChart size={16} />
            開發路線圖
          </div>

          <h2 className="text-3xl font-black tracking-tight">
            從現在的前端原型逐步走向真正平台
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((phase) => (
            <div
              key={phase.phase}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                {phase.phase}
              </div>

              <h3 className="text-lg font-black">{phase.title}</h3>

              <ul className="mt-4 grid gap-2">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-6 text-slate-600"
                  >
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-blue-600"
                      size={16}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 lg:grid-cols-3 lg:px-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 lg:col-span-2">
            <h2 className="flex items-center gap-2 text-2xl font-black">
              <MessageCircle size={24} />
              下一步要接 OpenAI API 時的檔案結構
            </h2>

            <pre className="mt-5 overflow-x-auto rounded-3xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">
{`app/
  page.tsx                    # 目前這個 Pro 首頁
  translate/page.tsx           # 單筆翻譯工作台
  translate/batch/page.tsx     # 大量翻譯頁
  iphone-guide/page.tsx        # iPhone 教學頁
  api/translate/route.ts       # 呼叫 OpenAI API
  api/jobs/route.ts            # 建立大量翻譯任務
  api/jobs/[jobId]/route.ts    # 查詢任務進度
data/
  glossary.json                # 初期術語庫
lib/
  openai.ts                    # 伺服器端 OpenAI client
  glossary.ts                  # 術語比對與 prompt 組裝`}
            </pre>
          </div>

          <div className="rounded-[2rem] border border-blue-100 bg-blue-50 p-6">
            <h3 className="flex items-center gap-2 text-xl font-black text-blue-950">
              <HelpCircle size={22} />
              目前版本定位
            </h3>

            <p className="mt-4 leading-8 text-blue-900/80">
              這版是「前端策略重構版」，可直接取代原本首頁。
              它尚未真正呼叫 OpenAI API，但已經把未來 API、術語庫、
              大量翻譯與 iPhone 備援流程的入口位置安排好。
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-6">
          <div>召會 AI 工具中心 v1.0 Pro｜Chrome 桌面優先測試版</div>
          <div>站內翻譯為主｜ChatGPT App 為輔｜術語庫為準</div>
        </div>
      </footer>
    </main>
  );
}