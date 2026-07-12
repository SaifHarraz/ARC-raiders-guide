import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'غير مصرح - Saif',
  description: 'ليس لديك صلاحية للوصول إلى هذه الصفحة',
};

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          غير مصرح بالدخول
        </h1>

        <p className="text-muted-foreground mb-2">
          ليس لديك صلاحية للوصول إلى هذه الصفحة
        </p>

        <p className="text-sm text-muted-foreground mb-8">
          هذه الصفحة متاحة فقط للمسؤولين. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الإدارة.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            العودة للرئيسية
          </Link>
          <Link
            href="/profile"
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            الملف الشخصي
          </Link>
        </div>
      </div>
    </main>
  );
}
