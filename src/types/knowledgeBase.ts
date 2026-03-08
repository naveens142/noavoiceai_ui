export interface KnowledgeDocument {
  id: string
  name: string
  status: "processing" | "done"
  size: string
  type: string
  addedAt: string
}