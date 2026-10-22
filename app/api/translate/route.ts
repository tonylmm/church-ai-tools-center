import { NextResponse } from "next/server";
import glossary from "../../../data/glossary.json";

export const runtime = "nodejs";

const MODEL_PRICES: Record<string, { input: number; output: number }> = {
  "gpt-6-luna": { input: 0.1, output: 0.5 },
  "gpt-6.1-sol": { input: 2, output: 10 },
};

const ALLOWED_MODELS = new Set(Object.keys(MODEL_PRICES));
const MAX_CHARS = 5000;

function buildGlossaryText() {
  return glossary
    .map(
      (item) =>
        `- ${item.source} → ${item.english}${item.note ? `（${item.note}）` : ""}`
    )
    .join("\n");
}

function extractOutputText(data: any): string {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks: string[] = [];
  for (const item of data?.output ?? []) {
    if (item?.type !== "message") continue;
    for (const content of item?.content ?? []) {
      if (content?.type === "output_text" && typeof content?.text === "string") {
        chunks.push(content.text);
      }
    }
  }
  return chunks.join("\n").trim();
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "伺服器尚未設定 OPENAI_API_KEY。" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const targetLanguage =
      typeof body?.targetLanguage === "string" ? body.targetLanguage.trim() : "英文";
    const mode = typeof body?.mode === "string" ? body.mode.trim() : "召會用語優先";
    const requestedModel =
      typeof body?.model === "string" ? body.model : "gpt-6-luna";
    const model = ALLOWED_MODELS.has(requestedModel)
      ? requestedModel
      : "gpt-6-luna";

    if (!text) {
      return NextResponse.json({ error: "請輸入要翻譯的內容。" }, { status: 400 });
    }

    if (text.length > MAX_CHARS) {
      return NextResponse.json(
        { error: `單次最多 ${MAX_CHARS.toLocaleString()} 字，目前為 ${text.length.toLocaleString()} 字。` },
        { status: 400 }
      );
    }

    const glossaryText = buildGlossaryText();

    const instructions = `你是「主恢復中的召會翻譯專家」。你的任務是提供準確、自然、可實際用於聚會、交通、福音與服事的翻譯。\n\n翻譯原則：\n1. 優先保留主恢復中的固定用語與屬靈語意，不要任意改成一般宗教術語。\n2. 使用者選擇的翻譯模式是：「${mode}」。\n3. 目標語言是：「${targetLanguage}」。\n4. 若來源是中文、目標語言不是英文，先在內部建立準確英文中介語意，再生成目標語言；不要輸出中間推理過程。\n5. 若涉及聖經經文或經文引用，優先採用 Recovery Version／恢復本的術語與語氣。若系統沒有提供可核對的完整經文資料，不要假裝能逐字保證官方經文，應忠實翻譯並保留章節引用。\n6. 不要增加原文沒有的神學解釋。\n7. 只輸出翻譯結果，不要加前言、分析或解說。\n\n目前內建術語表：\n${glossaryText}`;

    const payload: Record<string, any> = {
      model,
      instructions,
      input: text,
      store: false,
      max_output_tokens: 12000,
    };

    if (model === "gpt-6-luna") {
      payload.reasoning = { effort: "none" };
    } else {
      payload.reasoning = { effort: "low" };
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return NextResponse.json(
        {
          error:
            data?.error?.message || "OpenAI API 呼叫失敗，請稍後再試。",
        },
        { status: response.status }
      );
    }

    const translation = extractOutputText(data);
    if (!translation) {
      return NextResponse.json(
        { error: "模型沒有回傳可讀取的翻譯結果。" },
        { status: 502 }
      );
    }

    const inputTokens = Number(data?.usage?.input_tokens ?? 0);
    const outputTokens = Number(data?.usage?.output_tokens ?? 0);
    const prices = MODEL_PRICES[model];
    const estimatedCostUsd =
      (inputTokens / 1_000_000) * prices.input +
      (outputTokens / 1_000_000) * prices.output;

    return NextResponse.json({
      translation,
      model,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        estimatedCostUsd,
      },
      meta: {
        characters: text.length,
        targetLanguage,
        mode,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "伺服器處理翻譯時發生錯誤。" },
      { status: 500 }
    );
  }
}
