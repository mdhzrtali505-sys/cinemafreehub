import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { invalidateAdCache, type AdSlot } from "@/hooks/useAdSettings";
import { Megaphone, Save, ToggleLeft, ToggleRight, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminAdManager() {
  const [slots, setSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchSlots = async () => {
    const { data } = await supabase.from("ad_settings").select("*").order("created_at");
    if (data) setSlots(data as unknown as AdSlot[]);
    setLoading(false);
  };

  useEffect(() => { fetchSlots(); }, []);

  const updateSlot = async (slot: AdSlot) => {
    setSaving(slot.id);
    const { error } = await supabase
      .from("ad_settings")
      .update({
        ad_key: slot.ad_key,
        is_enabled: slot.is_enabled,
        width: slot.width,
        height: slot.height,
        slot_label: slot.slot_label,
      })
      .eq("id", slot.id);

    if (error) {
      toast.error("আপডেট ব্যর্থ হয়েছে");
    } else {
      toast.success("অ্যাড সেটিংস আপডেট হয়েছে ✓");
      invalidateAdCache();
    }
    setSaving(null);
  };

  const toggleEnabled = async (slot: AdSlot) => {
    const updated = { ...slot, is_enabled: !slot.is_enabled };
    setSlots((prev) => prev.map((s) => (s.id === slot.id ? updated : s)));
    await updateSlot(updated);
  };

  const handleFieldChange = (id: string, field: keyof AdSlot, value: any) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const deleteSlot = async (id: string) => {
    if (!confirm("এই অ্যাড স্লট ডিলিট করবেন?")) return;
    await supabase.from("ad_settings").delete().eq("id", id);
    setSlots((prev) => prev.filter((s) => s.id !== id));
    invalidateAdCache();
    toast.success("স্লট ডিলিট হয়েছে");
  };

  const addSlot = async () => {
    const name = `custom_${Date.now()}`;
    const { data, error } = await supabase
      .from("ad_settings")
      .insert({ slot_name: name, slot_label: "New Ad Slot", ad_type: "banner" })
      .select()
      .single();
    if (data) {
      setSlots((prev) => [...prev, data as unknown as AdSlot]);
      toast.success("নতুন স্লট যোগ হয়েছে");
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Ad Management — Adsterra</h2>
        </div>
        <button
          onClick={addSlot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors active:scale-[0.97]"
        >
          <Plus className="w-3.5 h-3.5" /> নতুন স্লট
        </button>
      </div>

      <div className="text-xs text-muted-foreground mb-2">
        Adsterra থেকে প্রতিটি অ্যাড ইউনিটের কী কপি করে এখানে পেস্ট করুন। সুইচ দিয়ে অন/অফ করুন।
      </div>

      <div className="space-y-3">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`rounded-xl border p-4 transition-colors ${
              slot.is_enabled && slot.ad_key
                ? "border-primary/30 bg-primary/[0.03]"
                : "border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    slot.ad_type === "popunder"
                      ? "bg-purple-500/10 text-purple-400"
                      : slot.ad_type === "reward" 
                        ? "bg-amber-500/10 text-amber-400" 
                        : "bg-primary/10 text-primary"
                  }`}>
                    {slot.ad_type}
                  </span>
                  <span className="text-xs text-muted-foreground">{slot.slot_name}</span>
                </div>
                <input
                  value={slot.slot_label}
                  onChange={(e) => handleFieldChange(slot.id, "slot_label", e.target.value)}
                  className="bg-transparent text-sm font-semibold text-foreground border-none outline-none w-full"
                  placeholder="Label..."
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleEnabled(slot)}
                  className="transition-colors"
                  title={slot.is_enabled ? "অ্যাড অন" : "অ্যাড অফ"}
                >
                  {slot.is_enabled ? (
                    <ToggleRight className="w-8 h-8 text-primary" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1 block">
                  Adsterra Ad Key
                </label>
                <input
                  value={slot.ad_key || ""}
                  onChange={(e) => handleFieldChange(slot.id, "ad_key", e.target.value)}
                  placeholder="e.g. 5677134"
                  className="w-full bg-foreground/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 transition-colors font-mono"
                />
              </div>

              {slot.ad_type !== "popunder" && (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1 block">Width</label>
                    <input
                      type="number"
                      value={slot.width}
                      onChange={(e) => handleFieldChange(slot.id, "width", parseInt(e.target.value) || 0)}
                      className="w-full bg-foreground/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 transition-colors tabular-nums"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1 block">Height</label>
                    <input
                      type="number"
                      value={slot.height}
                      onChange={(e) => handleFieldChange(slot.id, "height", parseInt(e.target.value) || 0)}
                      className="w-full bg-foreground/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 transition-colors tabular-nums"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-3 pt-3 border-t border-white/[0.04]">
              <button
                onClick={() => deleteSlot(slot.id)}
                className="flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
              <button
                onClick={() => updateSlot(slot)}
                disabled={saving === slot.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors active:scale-[0.97] disabled:opacity-50"
              >
                <Save className="w-3 h-3" />
                {saving === slot.id ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
