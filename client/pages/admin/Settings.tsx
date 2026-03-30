import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Palette, Building2, Tag, Users, Save } from 'lucide-react';

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

      <Tabs defaultValue="theme" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>

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
