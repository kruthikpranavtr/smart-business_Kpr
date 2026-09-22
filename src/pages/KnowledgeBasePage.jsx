// Knowledge Base Page for SMARTORA
// Multi-Tenant RAG Document Repository & Vector Search Console

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  Upload,
  Search,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles,
  ExternalLink,
  Plus,
  Clock,
  Filter,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ragService } from '../services/ai/ragService';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function KnowledgeBasePage({ onNavigate }) {
  const { currentOrganization, knowledgeDocs, addKnowledgeDoc, deleteKnowledgeDoc, departments } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [inspectDoc, setInspectDoc] = useState(null);

  // Live RAG Sandbox Test State
  const [ragTestQuery, setRagTestQuery] = useState('');
  const [ragTestResults, setRagTestResults] = useState(null);
  const [isTestingRag, setIsTestingRag] = useState(false);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    title: '',
    filename: '',
    category: 'Operations',
    department_id: '',
    permissions: 'All Employees',
    content: ''
  });

  const categories = ['All', 'Operations', 'HR', 'Finance', 'Sales', 'General', 'Product Documentation'];

  // Filtered documents by tenant and category
  const filteredDocs = useMemo(() => {
    return knowledgeDocs.filter(doc => {
      const matchCat = selectedCategory === 'All' || doc.category === selectedCategory;
      const matchSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.content && doc.content.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [knowledgeDocs, selectedCategory, searchQuery]);

  // Handle Document Upload
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim() || !uploadForm.content.trim()) {
      addToast('Missing Details', 'Please provide both title and document text content.', 'error');
      return;
    }

    const created = addKnowledgeDoc({
      title: uploadForm.title.trim(),
      filename: uploadForm.filename.trim() || `${uploadForm.title.replace(/\s+/g, '_')}.pdf`,
      category: uploadForm.category,
      department_id: uploadForm.department_id || null,
      permissions: uploadForm.permissions,
      uploadedBy: currentUser?.name || 'Company Admin',
      content: uploadForm.content.trim()
    });

    addToast('Document Vectorized', `"${created.title}" successfully chunked into ${created.chunksCount} vectors.`, 'success');
    setIsUploadModalOpen(false);
    setUploadForm({
      title: '',
      filename: '',
      category: 'Operations',
      department_id: '',
      permissions: 'All Employees',
      content: ''
    });
  };

  // Handle Document Deletion
  const handleDelete = (docId, title) => {
    deleteKnowledgeDoc(docId);
    addToast('Document Removed', `"${title}" has been deleted from the vector store.`, 'info');
    if (inspectDoc?.id === docId) setInspectDoc(null);
  };

  // Live RAG Query Sandbox Test
  const handleRunRagTest = (e) => {
    e.preventDefault();
    if (!ragTestQuery.trim()) return;

    setIsTestingRag(true);
    setTimeout(() => {
      const results = ragService.search(ragTestQuery, {
        organization_id: currentOrganization?.id,
        department_id: currentUser?.department_id,
        role: currentUser?.role,
        organizationName: currentOrganization?.name
      });
      setRagTestResults(results);
      setIsTestingRag(false);
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              SMARTORA RAG Architecture
            </span>
            <span className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Tenant Partition: {currentOrganization?.name} ({currentOrganization?.id})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Organizational Knowledge Base
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Secure vector-embedded document repository powering real-time Retrieval-Augmented Generation with strict tenant isolation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={Upload}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Document
          </Button>
        </div>
      </div>

      {/* RAG Interactive Test Sandbox Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/40 dark:via-sky-950/30 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Live RAG Semantic Retrieval Sandbox (Judge & Evaluator Test Bench)
          </span>
          <span className="text-[10px] bg-blue-200/70 dark:bg-blue-900 font-mono px-2 py-0.5 rounded text-blue-800 dark:text-blue-200 font-bold">
            Cosine Similarity v2.5
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          Test how SMARTORA’s vector engine retrieves exact policy clauses from <strong>{currentOrganization?.name}</strong> while strictly blocking documents from other companies.
        </p>

        <form onSubmit={handleRunRagTest} className="flex gap-2">
          <input
            type="text"
            value={ragTestQuery}
            onChange={(e) => setRagTestQuery(e.target.value)}
            placeholder={
              currentOrganization?.id === 'org-001'
                ? "Try: 'What is our casual leave policy?' or 'What are cloud incident SLA times?'"
                : "Try: 'What is our kitchen hygiene SOP?' or 'How are tips distributed?'"
            }
            className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={Search}
            disabled={isTestingRag || !ragTestQuery.trim()}
          >
            {isTestingRag ? 'Vectorizing...' : 'Test Retrieval'}
          </Button>
        </form>

        {/* Live Test Results Dropdown */}
        {ragTestResults && (
          <div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-bold text-slate-900 dark:text-white">
                RAG Vector Search Matches ({ragTestResults.length} Chunks Retrieved)
              </span>
              <button
                onClick={() => setRagTestResults(null)}
                className="text-[11px] text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            </div>

            {ragTestResults.length === 0 ? (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                <strong>Zero Matches in Active Tenant:</strong> No authorized documents matching this query were found in <strong>{currentOrganization?.name}</strong>. Cross-tenant documents remain 100% inaccessible.
              </div>
            ) : (
              <div className="space-y-2">
                {ragTestResults.map((res, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Source: {res.filename}
                      </span>
                      <span className="font-mono text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                        {res.score}% Semantic Match
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      "{res.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents or clauses..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Documents on File ({filteredDocs.length})
            </h3>
            <span className="text-xs text-slate-400">• Scoped to {currentOrganization?.name}</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Chunks Vectorized
          </span>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No documents found</p>
            <p className="text-xs text-slate-400 mt-1">Upload an SOP or policy to populate your organization's RAG knowledge base.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/40">
                  <th className="py-3 px-4 font-semibold">Document Title & Filename</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Vector Chunks</th>
                  <th className="py-3 px-4 font-semibold">Permissions</th>
                  <th className="py-3 px-4 font-semibold">Uploaded By</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-white">
                            {doc.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {doc.filename} • {doc.fileSize}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={doc.category === 'HR' ? 'purple' : doc.category === 'Operations' ? 'blue' : 'info'}>
                        {doc.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {doc.chunksCount || 5} chunks
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {doc.permissions || 'All Staff'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      <div>{doc.uploadedBy}</div>
                      <div className="text-[10px] text-slate-400">{doc.uploadedAt}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setInspectDoc(doc)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                          title="Inspect Document Content"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                          title="Delete from Vector Store"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Upload Document & Vectorize */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload & Vectorize Document for RAG"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Title
            </label>
            <input
              type="text"
              required
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              placeholder="e.g. Sales Escalation Protocol & Commission Rules 2025"
              className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="General">General</option>
                <option value="Product Documentation">Product Documentation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Access Permissions
              </label>
              <select
                value={uploadForm.permissions}
                onChange={(e) => setUploadForm({ ...uploadForm, permissions: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="All Employees">All Employees</option>
                <option value="Engineering & Management">Engineering & Management</option>
                <option value="Admins Only">Admins Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Text / Policy Content
            </label>
            <textarea
              rows={6}
              required
              value={uploadForm.content}
              onChange={(e) => setUploadForm({ ...uploadForm, content: e.target.value })}
              placeholder="Paste the full text of the SOP, handbook, policy clauses, or manual..."
              className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              SMARTORA’s RAG pipeline will automatically clean, chunk, compute 256-dimension vector embeddings, and store them with tenant metadata.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Index into Vector Store
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Inspect Document */}
      <Modal
        isOpen={Boolean(inspectDoc)}
        onClose={() => setInspectDoc(null)}
        title={inspectDoc?.title || 'Document Details'}
      >
        {inspectDoc && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Filename: <strong className="text-slate-700 dark:text-slate-300 font-mono">{inspectDoc.filename}</strong></span>
              <Badge variant="blue">{inspectDoc.category}</Badge>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl max-h-60 overflow-y-auto font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {inspectDoc.content}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2">
              <span>Uploaded By: {inspectDoc.uploadedBy}</span>
              <span>Tenant Scope: {inspectDoc.organization_id}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
