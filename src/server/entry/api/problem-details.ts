import "server-only";

// 失敗したときのレスポンス。RFC 9457（Problem Details）＋ code ＋ errors
// （docs/02_共通設計/09_外部公開API.md の「6」、docs/04_設計判断/ADR-010_APIのエラーの形.md）

export type ProblemCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export type ProblemDetails = {
  type: "about:blank";
  title: string;
  status: number;
  detail: string;
  code: ProblemCode;
  errors?: Partial<Record<string, string[]>>;
};

// title はステータスコードの英語の名前にする
const TITLES: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Content",
  429: "Too Many Requests",
  500: "Internal Server Error",
};

export function problemResponse(params: {
  status: number;
  code: ProblemCode;
  detail: string;
  // code が VALIDATION_ERROR のときだけ渡す
  errors?: ProblemDetails["errors"];
}): Response {
  const body: ProblemDetails = {
    type: "about:blank",
    title: TITLES[params.status] ?? "Error",
    status: params.status,
    detail: params.detail,
    code: params.code,
    ...(params.errors && { errors: params.errors }),
  };
  return Response.json(body, {
    status: params.status,
    headers: { "Content-Type": "application/problem+json" },
  });
}
