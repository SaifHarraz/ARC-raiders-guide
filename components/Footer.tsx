import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              Saif
            </h3>
            <p className="text-sm text-muted-foreground">
              دليلك الشامل للعبة ARC Raiders - قواعد بيانات، خرائط، أدلة، وأدوات
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/items"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  العناصر
                </Link>
              </li>
              <li>
                <Link
                  href="/maps"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  الخرائط
                </Link>
              </li>
              <li>
                <Link
                  href="/traders"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  التجار
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  الأحداث
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h4 className="font-semibold">المجتمع</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blogs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  المدونة
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  السوق
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  لوحة التحكم
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-start">
            <p>© {currentYear} Saif. جميع الحقوق محفوظة.</p>
            <p className="mt-1">
              البيانات مقدمة من{" "}
              <a
                href="https://metaforge.app/arc-raiders"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                MetaForge
              </a>
            </p>
            <p className="mt-1">
              © {currentYear} Saif - حقوق الملكية الفكرية وجميع المحتويات الخاصة بلعبة ARC Raiders تعود إلى Embark Studios. هذا الموقع هو مشروع من صنع المعجبين فقط، ولا يمثل أو يتبع شركة Embark Studios بأي شكل من الأشكال.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
