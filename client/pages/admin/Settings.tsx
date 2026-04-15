import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Palette, Building2, Tag, Users, Save, Trash2, Edit2, Plus } from 'lucide-react';
import { DateRangeFilter } from '@/components/admin/DateRangeFilter';
import { apiFetch } from '@/hooks/useApi';

export default function AdminSettings() {
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    // Theme
    primaryColor: '#2563eb',
    secondaryColor: '#9333ea',
    backgroundColor: '#ffffff',
    textColor: '#166562',
    textStyle: 'Outfit',

    // Company
    companyName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    gstNumber: '',
    logo: '' ,
  });

  // Database settings state
  const [dbSettings, setDbSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ key: '', value: '', description: '', category: '' });

  // Fetch settings from API
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async (start?: string | null, end?: string | null) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);

      const data = await apiFetch(`/api/settings?${params.toString()}`, 'GET');
      setDbSettings(data.data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
    fetchSettings(start, end);
  };

  const handleAddSetting = async () => {
    if (!formData.key || !formData.value) {
      toast({ title: 'Error', description: 'Key and value are required' });
      return;
    }

    try {
      await apiFetch('/api/settings', 'POST', formData);
      setFormData({ key: '', value: '', description: '', category: '' });
      toast({ title: 'Success', description: 'Setting added successfully' });
      fetchSettings(startDate, endDate);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add setting' });
    }
  };

  const handleDeleteSetting = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this setting?')) return;

    try {
      await apiFetch(`/api/settings/${id}`, 'DELETE');
      toast({ title: 'Success', description: 'Setting deleted successfully' });
      fetchSettings(startDate, endDate);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete setting' });
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('fp_settings', JSON.stringify(settings));
    toast({ title: 'Saved', description: 'Settings updated successfully' });
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Admin Settings</h2>
        <Button onClick={handleSave} className="gap-2">
          <Save className="size-4" /> Save
        </Button>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="database">Database Settings</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-4">
          <div className="space-y-4">
            <DateRangeFilter
              onDateRangeChange={handleDateRangeChange}
              isLoading={isLoading}
            />

            {/* Add New Setting Form */}
            <Card title="Add New Setting" icon={<Plus />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Key"
                  value={formData.key}
                  onChange={(v) => setFormData({ ...formData, key: v })}
                  placeholder="e.g., site_title"
                />
                <InputField
                  label="Category"
                  value={formData.category}
                  onChange={(v) => setFormData({ ...formData, category: v })}
                  placeholder="e.g., general"
                />
              </div>
              <TextareaField
                label="Value"
                value={formData.value}
                onChange={(v) => setFormData({ ...formData, value: v })}
                placeholder="Setting value"
              />
              <InputField
                label="Description"
                value={formData.description}
                onChange={(v) => setFormData({ ...formData, description: v })}
                placeholder="Optional description"
              />
              <Button
                onClick={handleAddSetting}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Setting
              </Button>
            </Card>

            {/* Settings Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border p-6 bg-white shadow-sm"
            >
              <h3 className="font-semibold mb-4">Settings List</h3>
              {dbSettings.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No settings found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left text-sm font-medium text-gray-700">
                        <th className="pb-3">Key</th>
                        <th className="pb-3">Value</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Created</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbSettings.map((item: any) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium text-sm">{item.key}</td>
                          <td className="py-3 text-sm text-gray-600 max-w-xs truncate">
                            {item.value}
                          </td>
                          <td className="py-3 text-sm">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {item.category || '-'}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-gray-500">
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button className="p-1 hover:bg-gray-200 rounded">
                                <Edit2 className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteSetting(item.id)}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </TabsContent>

        {/* Theme */}
        <TabsContent value="theme">
          <Card title="Theme Settings" icon={<Palette />}>
            <ColorField label="Primary Color" value={settings.primaryColor} onChange={(v) => handleChange('primaryColor', v)} />
            <ColorField label="Secondary Color" value={settings.secondaryColor} onChange={(v) => handleChange('secondaryColor', v)} />
            <ColorField label="Background Color" value={settings.backgroundColor} onChange={(v) => handleChange('backgroundColor', v)} />
            <ColorField label="Text Color" value={settings.textColor} onChange={(v) => handleChange('textColor', v)} />
            <InputField label="Text Style" value={settings.textStyle} onChange={(v) => handleChange('textStyle', v)} />
          </Card>
        </TabsContent>

        {/* Company */}
        <TabsContent value="company">
          <Card title="Company Details" icon={<Building2 />}>
            <InputField label="Company Name" value={settings.companyName} onChange={(v) => handleChange('companyName', v)} />
            <InputField label="Email" value={settings.email} onChange={(v) => handleChange('email', v)} />
            <InputField label="Phone" value={settings.phone} onChange={(v) => handleChange('phone', v)} />
            <InputField label="Website" value={settings.website} onChange={(v) => handleChange('website', v)} />
            <InputField label="GST Number" value={settings.gstNumber} onChange={(v) => handleChange('gstNumber', v)} />
            <TextareaField label="Address" value={settings.address} onChange={(v) => handleChange('address', v)} />

            {/* Logo Upload */}
            <div>
              <Label>Company Logo</Label>
              <div className="mt-2 flex flex-col items-center gap-3">
                {settings.logo && (
                  <img src={settings.logo} alt="logo" className="h-20 object-contain" />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        handleChange('logo', reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>
            
          </Card>
        </TabsContent>



      </Tabs>

    </div>
  );
}

// Reusable Components
function Card({ title, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-6 bg-white shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2 font-semibold">
        {icon} {title}
      </div>
      {children}
    </motion.div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextareaField({ label, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}
