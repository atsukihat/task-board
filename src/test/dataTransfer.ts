// jsdom には DataTransfer が無いため、ドラッグ操作のテスト用に最小限を用意する
export function createDataTransfer(): DataTransfer {
  const store = new Map<string, string>();
  return {
    dropEffect: "none",
    effectAllowed: "all",
    setData: (type: string, value: string) => void store.set(type, value),
    getData: (type: string) => store.get(type) ?? "",
  } as DataTransfer;
}
