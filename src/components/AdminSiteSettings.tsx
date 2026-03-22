import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { invalidateSiteSettingsCache } from "@/hooks/useSiteSettings";
import { Upload, Save, Image, Type } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Settings {
  id: string;
  site_name: string;
  logo_url: string | null;
}

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("id, site_name, logo_url")
      .limit(1)
      .single();
    if (data) setSettings(data as Settings);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ site_name: settings.site_name, logo_url: settings.logo_url, updated_at: new Date().toISOString() })
      .eq("id", settings.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      invalidateSiteSettingsCache();
      toast({ title: "সেভ হয়েছে!", description: "সাইট সেটিংস আপডেট হয়েছে।" });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `logo.${ext}`;

    // Remove old logo if exists
    await supabase.storage.from("site-assets").remove([path]);

    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Upload Error", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("site-assets").getPublicUrl(path);
    const logoUrl = urlData.publicUrl + "?t=" + Date.now();
    setSettings({ ...settings, logo_url: logoUrl });
    setUploading(false);
  };

  const handleRemoveLogo = () => {
    if (settings) setSettings({ ...settings, logo_url: null });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!settings) return <p className="text-muted-foreground text-center py-8">সেটিংস লোড হয়নি</p>;

  return (
    <div className="space-y-6">
      <div className="glass-bg rounded-xl border border-white/[0.06] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
          <Type className="w-4 h-4 text-muted-foreground" /> সাইটের নাম
        </h2>
        <input
          type="text"
          value={settings.site_name}
          onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
          className="w-full bg-foreground/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="সাইটের নাম লিখুন..."
        />
      </div>

      <div className="glass-bg rounded-xl border border-white/[0.06] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
          <Image className="w-4 h-4 text-muted-foreground" /> সাইট লোগো
        </h2>

        {settings.logo_url ? (
          <div className="mb-4 space-y-3">
            <div className="bg-foreground/[0.04] rounded-lg p-4 flex items-center justify-center">
              <img src={settings.logo_url} alt="Logo" className="max-h-20 max-w-[200px] object-contain" />
            </div>
            <button
              onClick={handleRemoveLogo}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              লোগো রিমুভ করুন
            </button>
          </div>
        ) : (
          <div className="mb-4 bg-foreground/[0.04] rounded-lg p-6 text-center text-sm text-muted-foreground">
            কোনো লোগো আপলোড করা হয়নি — ডিফল্ট SVG লোগো ব্যবহার হচ্ছে
          </div>
        )}

        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/[0.06] border border-white/[0.08] text-sm text-foreground cursor-pointer hover:bg-foreground/[0.1] transition-colors">
          <Upload className="w-4 h-4" />
          {uploading ? "আপলোড হচ্ছে..." : "লোগো আপলোড করুন"}
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} />
        </label>
        <p className="text-xs text-muted-foreground mt-2">PNG, JPG, SVG — সর্বোচ্চ 2MB</p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? "সেভ হচ্ছে..." : "সেটিংস সেভ করুন"}
      </button>
    </div>
  );
}
