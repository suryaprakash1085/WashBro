import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Palette, Image, Type, Tag, Save } from 'lucide-react';

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    heroTitle: 'Quality Laundry Service Delivered to Your Doorstep',
    heroSubtitle: 'From wash & fold to dry cleaning — we pick up, clean, and deliver your clothes with meticulous care.',
    offerText: '🎉 New customers get 20% off their first order!',
    themeColor: '#2563eb',
    footerText: '© 2025 FreshPress. All rights reserved.',
  });

  const handleSave = () => {
    localStorage.setItem('fp_settings', JSON.stringify(settings));
    toast({ title: 'Settings saved', description: 'Your changes have been applied.' });
  };

  const sections = [
    { icon: Palette, title: 'Theme', fields: [
      { key: 'themeColor', label: 'Primary Color', type: 'color' },
    ]},
    { icon: Type, title: 'Footer', fields: [
      { key: 'footerText', label: 'Footer Copyright Text', type: 'input' },
    ]},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[Outfit] text-lg font-semibold">App Settings</h2>
        <Button onClick={handleSave} className="gap-1.5"><Save className="size-4" /> Save Changes</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <section.icon className="size-5" />
              </div>
              <h3 className="font-[Outfit] text-base font-semibold">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <Label>{field.label}</Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={(settings as any)[field.key]}
                      onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                      rows={3}
                    />
                  ) : field.type === 'color' ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={(settings as any)[field.key]}
                        onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                        className="size-10 cursor-pointer rounded-lg border"
                      />
                      <Input
                        value={(settings as any)[field.key]}
                        onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  ) : (
                    <Input
                      value={(settings as any)[field.key]}
                      onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Image className="size-5" />
          </div>
          <h3 className="font-[Outfit] text-base font-semibold">Logo & Banner</h3>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label>Website Logo</Label>
            <div className="mt-2 flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 text-sm text-muted-foreground transition-colors hover:border-primary/50">
              <p>Drag & drop or click to upload</p>
            </div>
          </div>
          <div>
            <Label>Home Banner</Label>
            <div className="mt-2 flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 text-sm text-muted-foreground transition-colors hover:border-primary/50">
              <p>Drag & drop or click to upload</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
