import { SettingCategory, SettingValueType } from "@/lib/generated/prisma/client";

export interface DefaultSetting {
  key: string;
  value: string;
  valueType: SettingValueType;
  category: SettingCategory;
  label: string;
  labelAr: string;
  description?: string;
  descriptionAr?: string;
}

export const defaultSettings: DefaultSetting[] = [
  // General Settings
  {
    key: "site_name",
    value: "Saif",
    valueType: "STRING",
    category: "GENERAL",
    label: "Site Name",
    labelAr: "اسم الموقع",
    description: "The name of the website displayed in headers and titles",
    descriptionAr: "اسم الموقع المعروض في الرؤوس والعناوين",
  },
  {
    key: "site_description",
    value: "ARC Raiders Community",
    valueType: "STRING",
    category: "GENERAL",
    label: "Site Description",
    labelAr: "وصف الموقع",
    description: "A brief description of the website",
    descriptionAr: "وصف موجز للموقع",
  },
  {
    key: "maintenance_mode",
    value: "false",
    valueType: "BOOLEAN",
    category: "GENERAL",
    label: "Maintenance Mode",
    labelAr: "وضع الصيانة",
    description: "Enable to show maintenance page to non-admin users",
    descriptionAr: "تفعيل لعرض صفحة الصيانة للمستخدمين غير المشرفين",
  },
  {
    key: "maintenance_message",
    value: "الموقع تحت الصيانة، سنعود قريباً",
    valueType: "STRING",
    category: "GENERAL",
    label: "Maintenance Message",
    labelAr: "رسالة الصيانة",
    description: "Message to display on maintenance page",
    descriptionAr: "الرسالة المعروضة في صفحة الصيانة",
  },

  // Feature Toggles
  {
    key: "enable_marketplace",
    value: "true",
    valueType: "BOOLEAN",
    category: "FEATURES",
    label: "Enable Marketplace",
    labelAr: "تفعيل السوق",
    description: "Allow users to create and view marketplace listings",
    descriptionAr: "السماح للمستخدمين بإنشاء وعرض عروض السوق",
  },
  {
    key: "enable_chat",
    value: "true",
    valueType: "BOOLEAN",
    category: "FEATURES",
    label: "Enable Chat",
    labelAr: "تفعيل المحادثات",
    description: "Allow users to chat with each other",
    descriptionAr: "السماح للمستخدمين بالتواصل مع بعضهم",
  },
  {
    key: "enable_guides",
    value: "true",
    valueType: "BOOLEAN",
    category: "FEATURES",
    label: "Enable Guides",
    labelAr: "تفعيل الأدلة",
    description: "Allow users to view and create guides",
    descriptionAr: "السماح للمستخدمين بعرض وإنشاء الأدلة",
  },
  {
    key: "enable_maps",
    value: "true",
    valueType: "BOOLEAN",
    category: "FEATURES",
    label: "Enable Interactive Maps",
    labelAr: "تفعيل الخرائط التفاعلية",
    description: "Allow users to view and add markers on maps",
    descriptionAr: "السماح للمستخدمين بعرض وإضافة علامات على الخرائط",
  },
  {
    key: "enable_registration",
    value: "true",
    valueType: "BOOLEAN",
    category: "FEATURES",
    label: "Enable Registration",
    labelAr: "تفعيل التسجيل",
    description: "Allow new users to register",
    descriptionAr: "السماح للمستخدمين الجدد بالتسجيل",
  },

  // Security Settings
  {
    key: "session_timeout_hours",
    value: "720",
    valueType: "NUMBER",
    category: "SECURITY",
    label: "Session Timeout (hours)",
    labelAr: "مهلة الجلسة (ساعات)",
    description: "How long before user sessions expire",
    descriptionAr: "المدة قبل انتهاء جلسات المستخدمين",
  },
  {
    key: "max_login_attempts",
    value: "5",
    valueType: "NUMBER",
    category: "SECURITY",
    label: "Max Login Attempts",
    labelAr: "الحد الأقصى لمحاولات تسجيل الدخول",
    description: "Maximum failed login attempts before lockout",
    descriptionAr: "الحد الأقصى لمحاولات تسجيل الدخول الفاشلة قبل الحظر",
  },
  {
    key: "rate_limit_requests",
    value: "100",
    valueType: "NUMBER",
    category: "SECURITY",
    label: "Rate Limit (requests/min)",
    labelAr: "حد المعدل (طلبات/دقيقة)",
    description: "Maximum API requests per minute per user",
    descriptionAr: "الحد الأقصى لطلبات API في الدقيقة لكل مستخدم",
  },
];
