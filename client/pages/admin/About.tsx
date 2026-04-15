import { useState, useEffect } from 'react';
import { useAboutStore } from '@/stores/aboutStore';
import AdminModal from '@/components/admin/AdminModal';
import AdminCard from '@/components/admin/AdminCard';
import FormField from '@/components/admin/FormField';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { DateRangeFilter } from '@/components/admin/DateRangeFilter';
import { apiFetch } from '@/hooks/useApi';

export default function AdminAbout() {
  const { content, updateContent } = useAboutStore();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState(content);

  // Database about content state
  const [dbContent, setDbContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [newContent, setNewContent] = useState({ title: '', section: '', description: '', content: '' });
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch about content from API
  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async (start?: string | null, end?: string | null) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);

      const data = await apiFetch(`/api/about?${params.toString()}`, 'GET');
      setDbContent(data.data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load about content' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
    fetchAboutContent(start, end);
  };

  const handleAddContent = async () => {
    if (!newContent.title || !newContent.section || !newContent.description) {
      toast({ title: 'Error', description: 'Title, section, and description are required' });
      return;
    }

    try {
      await apiFetch('/api/about', 'POST', newContent);
      setNewContent({ title: '', section: '', description: '', content: '' });
      setShowAddModal(false);
      toast({ title: 'Success', description: 'Content added successfully' });
      fetchAboutContent(startDate, endDate);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add content' });
    }
  };

  const handleDeleteContent = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;

    try {
      await apiFetch(`/api/about/${id}`, 'DELETE');
      toast({ title: 'Success', description: 'Content deleted successfully' });
      fetchAboutContent(startDate, endDate);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete content' });
    }
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
    setFormData(content);
    setShowModal(true);
  };

  const handleSave = () => {
    updateContent(formData);
    setShowModal(false);
    toast({ title: 'Content updated', description: 'About page content has been saved.' });
  };

  const sections = [
    {
      title: 'Main Section',
      fields: [
        { key: 'title', label: 'Page Title' },
        { key: 'subtitle', label: 'Page Subtitle' },
      ],
    },
    {
      title: 'Company Information',
      fields: [
        { key: 'missionTitle', label: 'Mission Title' },
        { key: 'missionDescription', label: 'Mission Description' },
        { key: 'visionTitle', label: 'Vision Title' },
        { key: 'visionDescription', label: 'Vision Description' },
      ],
    },
    {
      title: 'Team Section',
      fields: [
        { key: 'teamTitle', label: 'Team Title' },
        { key: 'teamDescription', label: 'Team Description' },
      ],
    },
    {
      title: 'Values Section',
      fields: [{ key: 'valuesTitle', label: 'Values Title' }],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[Outfit] text-lg font-semibold">About Page Content</h2>
        <p className="text-sm text-muted-foreground">Manage your about page sections</p>
      </div>

      {/* Database Content Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-base">Database Content</h3>
          <Button
            onClick={() => setShowAddModal(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4" /> Add Content
          </Button>
        </div>

        <DateRangeFilter
          onDateRangeChange={handleDateRangeChange}
          isLoading={isLoading}
        />

        {/* Content Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-6 bg-white shadow-sm"
        >
          {dbContent.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No content found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm font-medium text-gray-700">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Section</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Created</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dbContent.map((item: any) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium text-sm">{item.title}</td>
                      <td className="py-3 text-sm">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {item.section}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-600 max-w-xs truncate">
                        {item.description || '-'}
                      </td>
                      <td className="py-3 text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDeleteContent(item.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section, i) => (
          <AdminCard key={section.title} title={section.title} delay={i * 0.08}>
            <div className="space-y-4">
              {section.fields.map(field => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-3"
                >
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {field.label}
                    </p>
                    <p className="mt-2 text-sm text-foreground line-clamp-2">
                      {(content as any)[field.key]}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => handleEdit(field.key)}
                  >
                    <Edit2 className="size-3.5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminModal
        open={showModal}
        title={`Edit ${editingField?.replace(/([A-Z])/g, ' $1').trim()}`}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        submitLabel="Save Changes"
      >
        {editingField && (
          <FormField
            label={`${editingField?.replace(/([A-Z])/g, ' $1').trim()}`}
            type={editingField?.includes('Description') ? 'textarea' : 'text'}
            value={(formData as any)[editingField] || ''}
            onChange={value =>
              setFormData(prev => ({
                ...prev,
                [editingField]: value,
              }))
            }
            rows={editingField?.includes('Description') ? 4 : undefined}
          />
        )}
      </AdminModal>

      {/* Add Content Modal */}
      <AdminModal
        open={showAddModal}
        title="Add New Content"
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddContent}
        submitLabel="Add Content"
      >
        <div className="space-y-4">
          <FormField
            label="Title"
            type="text"
            value={newContent.title}
            onChange={(v) => setNewContent({ ...newContent, title: v })}
            placeholder="Content title"
          />
          <FormField
            label="Section"
            type="text"
            value={newContent.section}
            onChange={(v) => setNewContent({ ...newContent, section: v })}
            placeholder="e.g., mission, vision, team"
          />
          <FormField
            label="Description"
            type="textarea"
            value={newContent.description}
            onChange={(v) => setNewContent({ ...newContent, description: v })}
            placeholder="Short description"
            rows={2}
          />
          <FormField
            label="Content"
            type="textarea"
            value={newContent.content}
            onChange={(v) => setNewContent({ ...newContent, content: v })}
            placeholder="Detailed content"
            rows={4}
          />
        </div>
      </AdminModal>
    </div>
  );
}
