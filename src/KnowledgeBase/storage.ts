export interface KnowledgeDocument {
  id: string
  name: string
  status: "processing" | "done"
  size: string
  type: string
  addedAt: string
  content: string   // base64 file
}

const STORAGE_KEY = "noa_kb_documents"

export const getDocuments = (): KnowledgeDocument[] => {
  const docs = localStorage.getItem(STORAGE_KEY)
  return docs ? JSON.parse(docs) : []
}

export const saveDocument = (doc: KnowledgeDocument) => {
  const docs = getDocuments()
  docs.push(doc)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
}

export const deleteDocument = (id: string) => {
  const docs = getDocuments().filter(d => d.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
}