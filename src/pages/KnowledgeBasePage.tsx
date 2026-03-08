import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Upload, Loader2, Trash2, X } from "lucide-react"
import useKnowledgeBase from "../features/agents/hooks/useKnowledgeBase"
import KBLoader from "../features/agents/components/KBLoader"
import { getFileIcon } from "../KnowledgeBase/fileIcons"
import type { KnowledgeBase } from "../features/agents/types"

export default function KnowledgeBasePage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [documentName, setDocumentName] = useState("")
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const { knowledgeBases, loading, fetchAllKnowledgeBases, upload, Delete } =
    useKnowledgeBase()

  useEffect(() => {
    loadKnowledgeBases()
  }, [])

  const loadKnowledgeBases = async () => {
    await fetchAllKnowledgeBases(0, 100)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      setPendingFile(file)
      setShowUploadForm(true)
      setDocumentName(file.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPendingFile(file)
      setShowUploadForm(true)
      setDocumentName(file.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleUpload = async () => {
    if (!pendingFile || !documentName.trim()) {
      toast.error("Please provide a document name")
      return
    }

    try {
      const result = await upload(pendingFile, documentName.trim())
      if (result.success) {
        toast.success(`Document "${documentName}" uploaded successfully!`)
        setDocumentName("")
        setPendingFile(null)
        setShowUploadForm(false)
        await loadKnowledgeBases()
      } else {
        toast.error(result.error || "Upload failed")
      }
    } catch (error: any) {
      toast.error(error.message || "Upload failed")
    }
  }

  const handleDelete = async (kbId: string, kbName: string) => {
    if (!window.confirm(`Delete "${kbName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const result = await Delete(kbId)
      if (result.success) {
        toast.success("Document deleted successfully!")
        await loadKnowledgeBases()
      } else {
        toast.error(result.error || "Failed to delete document")
      }
    } catch (error: any) {
      toast.error(error.message || "Delete failed")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-8 text-white">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-8">Knowledge Base</h1>

      {/* UPLOAD AREA */}
      {!showUploadForm ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer
          ${
            dragActive
              ? "border-cyan-400 bg-cyan-400/10"
              : "border-cyan-500/20 bg-[#0b1220] hover:border-cyan-400/40"
          }`}
        >
          <Upload size={32} className="mx-auto mb-3 text-cyan-400" />

          <p className="text-lg font-medium mb-2">
            Upload Knowledge Document
          </p>

          <p className="text-sm text-gray-400 mb-6">
            Drag and drop your file here, or click to browse
          </p>

          <p className="text-xs text-gray-500 mb-6">
            Supported: PDF, DOCX, XLSX, TXT • Max 10 MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer px-6 py-3 rounded-lg
            border border-cyan-400/40
            hover:border-cyan-300
            hover:bg-cyan-400/10
            transition"
          >
            Choose File
          </button>
        </div>
      ) : (
        <div className="border border-cyan-400/20 rounded-2xl p-8 bg-white/5 backdrop-blur-xl space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upload Document</h3>
            <button
              onClick={() => {
                setShowUploadForm(false)
                setPendingFile(null)
                setDocumentName("")
              }}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* File Preview */}
          {pendingFile && (
            <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                File: <span className="font-medium">{pendingFile.name}</span>
              </p>
              <p className="text-xs text-gray-400">
                Size: {formatFileSize(pendingFile.size)}
              </p>
            </div>
          )}

          {/* Document Name Input */}
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Document Name
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Enter document name (e.g., Company FAQ)"
              className="w-full bg-white/5 border border-cyan-400/20 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            />
          </div>

          {/* Upload Button */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setShowUploadForm(false)
                setPendingFile(null)
                setDocumentName("")
              }}
              className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-lg text-gray-300 text-sm transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={loading || !documentName.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 rounded-lg text-cyan-300 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload & Save
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* DOCUMENT LIST */}
      <div className="mt-10 space-y-4">
        <h2 className="text-lg font-semibold mb-4">
          Uploaded Documents {knowledgeBases.length > 0 && `(${knowledgeBases.length})`}
        </h2>

        {loading && !showUploadForm ? (
          <KBLoader />
        ) : knowledgeBases.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No documents uploaded yet. Upload documents to use them in agents.
          </p>
        ) : (
          knowledgeBases.map((kb: KnowledgeBase) => (
            <div
              key={kb.id}
              className="border border-cyan-500/10 rounded-xl p-5
              bg-[#0b1220]
              hover:border-cyan-400/40
              hover:shadow-lg hover:shadow-cyan-500/10
              transition"
            >
              <div className="flex items-center justify-between">
                {/* LEFT */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl">
                    {getFileIcon(kb.file_type, kb.document_name)}
                  </div>

                  <div>
                    <div className="font-medium text-white">
                      {kb.document_name}
                    </div>

                    <div className="text-sm text-gray-400">
                      {kb.file_name} • {formatFileSize(kb.file_size)}
                    </div>

                    <div className="text-xs text-gray-500">
                      Uploaded {formatDate(kb.created_at)}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <button
                  onClick={() => handleDelete(kb.id, kb.document_name)}
                  disabled={loading}
                  className="text-sm px-4 py-2
                  border border-red-400/40
                  rounded-lg
                  hover:bg-red-400/10
                  transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}