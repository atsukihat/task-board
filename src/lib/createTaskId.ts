// crypto.randomUUID は安全なコンテキスト（HTTPS / localhost）でしか使えないため、
// http://192.168.x.x などでアクセスした場合に備えて代替の生成方法を用意する
export function createTaskId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
