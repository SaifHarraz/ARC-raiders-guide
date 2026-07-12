import { Ban, Mail, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-destructive/50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Ban className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-3xl text-destructive">تم حظر حسابك</CardTitle>
          <CardDescription className="text-base mt-2">
            Your Account Has Been Banned
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  تم تعليق حسابك بسبب انتهاك شروط الخدمة
                </p>
                <p className="text-xs text-muted-foreground">
                  Your account has been suspended for violating our terms of service. You can no longer access the platform.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">ماذا يعني هذا؟</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>لا يمكنك تسجيل الدخول إلى حسابك</li>
                <li>تم تعليق جميع أنشطتك على المنصة</li>
                <li>لا يمكنك الوصول إلى الإعلانات والمحادثات الخاصة بك</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">ماذا يمكنك فعله؟</h3>
              <p className="text-sm text-muted-foreground">
                إذا كنت تعتقد أن هذا الحظر خطأ، يرجى التواصل مع فريق الدعم للاستفسار عن سبب الحظر وإمكانية الاستئناف.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <Button variant="outline" asChild className="w-full">
              <Link href="mailto:support@Saif.com">
                <Mail className="w-4 h-4 ml-2" />
                تواصل مع الدعم
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/">
                العودة إلى الصفحة الرئيسية
              </Link>
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            إذا كنت بحاجة إلى مساعدة، يرجى الاتصال بنا على support@Saif.com
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
