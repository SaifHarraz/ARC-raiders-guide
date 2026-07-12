"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Globe, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Setting {
  id: string;
  key: string;
  value: string;
  valueType: string;
  label: string;
  labelAr: string;
  description?: string;
  descriptionAr?: string;
}

interface GeneralSettingsProps {
  settings: Setting[];
  onUpdate: () => void;
}

export function GeneralSettings({ settings, onUpdate }: GeneralSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    settings.forEach((s) => {
      initial[s.key] = s.value;
    });
    return initial;
  });
  const { toast } = useToast();

  const getSetting = (key: string) => settings.find((s) => s.key === key);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: Object.entries(values).map(([key, value]) => ({
            key,
            value,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "تم الحفظ",
          description: "تم حفظ الإعدادات بنجاح",
        });
        onUpdate();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const maintenanceMode = values.maintenance_mode === "true";

  return (
    <div className="space-y-6">
      {/* Site Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <div className="flex flex-col">
              <span>معلومات الموقع</span>
              <span className="text-sm font-normal text-muted-foreground">
                Site Information
              </span>
            </div>
          </CardTitle>
          <CardDescription>
            Basic site configuration and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Site Name */}
          <div className="space-y-2">
            <Label htmlFor="site_name">
              {getSetting("site_name")?.labelAr || "اسم الموقع"}
              <span className="text-xs text-muted-foreground mr-2">
                ({getSetting("site_name")?.label || "Site Name"})
              </span>
            </Label>
            <Input
              id="site_name"
              value={values.site_name || ""}
              onChange={(e) =>
                setValues({ ...values, site_name: e.target.value })
              }
              placeholder="Saif"
            />
            <p className="text-xs text-muted-foreground">
              {getSetting("site_name")?.descriptionAr}
            </p>
          </div>

          {/* Site Description */}
          <div className="space-y-2">
            <Label htmlFor="site_description">
              {getSetting("site_description")?.labelAr || "وصف الموقع"}
              <span className="text-xs text-muted-foreground mr-2">
                ({getSetting("site_description")?.label || "Site Description"})
              </span>
            </Label>
            <Textarea
              id="site_description"
              value={values.site_description || ""}
              onChange={(e) =>
                setValues({ ...values, site_description: e.target.value })
              }
              placeholder="ARC Raiders Community"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              {getSetting("site_description")?.descriptionAr}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card className={maintenanceMode ? "border-yellow-500/50" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle
              className={`h-5 w-5 ${maintenanceMode ? "text-yellow-500" : ""}`}
            />
            <div className="flex flex-col">
              <span>وضع الصيانة</span>
              <span className="text-sm font-normal text-muted-foreground">
                Maintenance Mode
              </span>
            </div>
          </CardTitle>
          <CardDescription>
            Enable maintenance mode to block non-admin users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Maintenance Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance_mode">
                {getSetting("maintenance_mode")?.labelAr || "وضع الصيانة"}
              </Label>
              <p className="text-sm text-muted-foreground">
                {getSetting("maintenance_mode")?.descriptionAr}
              </p>
            </div>
            <Switch
              id="maintenance_mode"
              checked={maintenanceMode}
              onCheckedChange={(checked) =>
                setValues({ ...values, maintenance_mode: String(checked) })
              }
            />
          </div>

          {/* Maintenance Message */}
          {maintenanceMode && (
            <div className="space-y-2">
              <Label htmlFor="maintenance_message">
                {getSetting("maintenance_message")?.labelAr || "رسالة الصيانة"}
                <span className="text-xs text-muted-foreground mr-2">
                  ({getSetting("maintenance_message")?.label || "Maintenance Message"})
                </span>
              </Label>
              <Textarea
                id="maintenance_message"
                value={values.maintenance_message || ""}
                onChange={(e) =>
                  setValues({ ...values, maintenance_message: e.target.value })
                }
                placeholder="الموقع تحت الصيانة، سنعود قريباً"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {getSetting("maintenance_message")?.descriptionAr}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>حفظ الإعدادات (Save)</span>
        </Button>
      </div>
    </div>
  );
}
