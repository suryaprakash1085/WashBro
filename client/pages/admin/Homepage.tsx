import { useState } from 'react';
import { useHomepageStore } from '@/stores/homepageStore';
import AdminModal from '@/components/admin/AdminModal';
import AdminCard from '@/components/admin/AdminCard';
import FormField from '@/components/admin/FormField';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Edit2, Save } from 'lucide-react';

export default function AdminHomepage() {
  const { content, updateContent } = useHomepageStore();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState(content);

  const handleEdit = (field: string) => {
    setEditingField(field);
    setFormData(content);
    setShowModal(true);
  };

  const handleSave = () => {
    updateContent(formData);
    setShowModal(false);
    toast({ title: 'Content updated', description: 'Homepage content has been saved.' });
  };

  const sections = [
    {
      title: 'Hero Section',
      fields: [
        { key: 'heroTitle', label: 'Hero Title' },
        { key: 'heroSubtitle', label: 'Hero Subtitle' },
      ],
    },
    {
      title: 'Promotions',
      fields: [{ key: 'offerBanner', label: 'Offer Banner' }],
    },
    {
      title: 'Services Section',
      fields: [
        { key: 'servicesTitle', label: 'Services Title' },
        { key: 'servicesSubtitle', label: 'Services Subtitle' },
      ],
    },
    {
      title: 'Call to Action',
      fields: [{ key: 'ctaText', label: 'CTA Text' }],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[Outfit] text-lg font-semibold">Homepage Content</h2>
        <p className="text-sm text-muted-foreground">Manage your homepage sections</p>
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
        title={`Edit ${editingField === 'heroTitle' ? 'Hero Title' : editingField === 'heroSubtitle' ? 'Hero Subtitle' : editingField?.replace(/([A-Z])/g, ' $1').trim()}`}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        submitLabel="Save Changes"
      >
        {editingField && (
          <FormField
            label={`${editingField?.replace(/([A-Z])/g, ' $1').trim()}`}
            type={editingField?.includes('Subtitle') || editingField?.includes('Description') ? 'textarea' : 'text'}
            value={(formData as any)[editingField] || ''}
            onChange={value =>
              setFormData(prev => ({
                ...prev,
                [editingField]: value,
              }))
            }
            rows={editingField?.includes('Subtitle') || editingField?.includes('Description') ? 4 : undefined}
          />
        )}
      </AdminModal>
    </div>
  );
}
