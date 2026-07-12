"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, AlertTriangle } from "lucide-react";

interface MarketplaceRulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss?: () => void;
}

const STORAGE_KEY = "marketplace-rules-shown";

export function MarketplaceRulesDialog({
  open,
  onOpenChange,
  onDismiss,
}: MarketplaceRulesDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
    onDismiss?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-black uppercase tracking-wide text-orange-400">
            مرحباً بك في سوق Saif
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground mt-2">
            أنشئ قوائم للبيع أو الشراء مقابل بذور أو عناصر أخرى. يمكن للاعبين
            الآخرين الرد، تتفاوضون، ويؤكد الطرفان عند اكتمال الصفقة.
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Safety Tips */}
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-green-400" />
              <h3 className="font-semibold text-green-400">نصائح الأمان</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>تحقق من سمعة اللاعب الآخر قبل التداول</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>قم بالتأكيد فقط بعد إتمام الصفقة داخل اللعبة</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>التأكيدات نهائية ولا يمكن إلغاؤها</span>
              </li>
            </ul>
          </div>

          {/* How to Trade */}
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-sky-400" />
              <h3 className="font-semibold text-sky-400">كيفية التداول</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              انضم إلى فريق، ادخل نفس الخريطة مع حقيبة آمنة، ألقِ العنصر الخاص بك
              وحدد موقعه، ثم التقط عنصر الطرف الآخر.
            </p>
          </div>

          {/* Important Rules */}
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <h3 className="font-semibold text-orange-400">قواعد مهمة</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span>
                  <strong className="text-foreground">Saif</strong> غير مسؤول عن
                  الصفقات
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span>
                  ممنوع التداول بأموال حقيقية - الصفقات للعناصر داخل اللعبة فقط
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Button
          onClick={handleClose}
          className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
        >
          فهمت
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// Hook to manage showing the dialog on first visit
export function useMarketplaceRulesDialog() {
  const [open, setOpen] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if rules have been shown before
    const hasShown = localStorage.getItem(STORAGE_KEY);
    if (!hasShown) {
      setOpen(true);
      setIsFirstVisit(true);
    }
  }, []);

  // Mark as shown when user dismisses the dialog
  const handleDismiss = useCallback(() => {
    if (isFirstVisit) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsFirstVisit(false);
    }
  }, [isFirstVisit]);

  return {
    open,
    setOpen,
    onDismiss: handleDismiss,
  };
}
