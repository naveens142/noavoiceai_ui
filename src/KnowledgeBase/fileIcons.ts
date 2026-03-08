export const getFileIcon = (type: string, name: string) => {
  const ext = name.split(".").pop()?.toLowerCase()

  if (type.includes("pdf") || ext === "pdf") return "📄"
  if (ext === "docx" || ext === "doc") return "📝"
  if (ext === "txt") return "📃"
  if (ext === "md") return "📘"

  return "📁"
}