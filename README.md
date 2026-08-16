# محاكي قرعة الحج

موقع عربي مستقل ومهيأ للهاتف يحاكي سحبًا واحدًا لقرعة الحج السياحي، باستخدام احتمالات محسوبة من أعداد المتقدمين والأماكن المتاحة في قرعة سابقة. الموقع ترفيهي وإحصائي فقط، ولا يمثل نتيجة أو جهة رسمية.

## التشغيل محليًا

يتطلب Node.js حديثًا (الإصدار 20 أو أحدث موصى به).

```bash
npm install
npm run dev
```

ثم افتح العنوان الذي يعرضه Vite. للاختبارات والبناء الإنتاجي:

```bash
npm test
npm run build
npm run preview
```

## أماكن التخصيص

- إحصاءات مستويات الحج: `src/data/hajjLevels.ts`
- أسماء شركات السياحة التجريبية: `src/data/companies.ts`
- رابط الدعم ومدة حركة السحب: `src/config.ts`
- موضع الإعلان القابل للاستبدال بـ Google AdSense: `src/components/AdSlot.tsx`
- منطق الاحتمال والعشوائية الآمنة: `src/utils/lottery.ts`

أسماء الشركات الحالية أمثلة لتشغيل البحث وليست قائمة اعتماد رسمية. يمكن استبدال المصفوفة بقائمة كاملة مع الاحتفاظ بالشكل `{ id, name }`.

## النشر الثابت

ينتج `npm run build` مجلد `dist` ثابتًا. إعدادات البناء المقترحة لكل من Cloudflare Pages وNetlify:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20 أو أحدث

ملف `public/_redirects` يتيح لمسارات React العمل على Netlify. على Cloudflare Pages، فعّل سلوك SPA fallback إن لم يُطبق تلقائيًا. لا يحتاج العرض الثابت إلى قاعدة بيانات، لكن حفظ سجل المحاولات مركزيًا وتجميع الموافقات التسويقية يحتاجان Cloudflare Pages Functions + D1 كما هو موضح أدناه.

يتضمن المشروع manifest وservice worker وأيقونة ليعمل كتطبيق ويب قابل للتثبيت. عند تفعيل AdSense مستقبلًا، استبدل محتوى `AdSlot.tsx` بتطبيق معتمد وحدّث سياسة الخصوصية؛ لا تجعل مشاهدة النتيجة مرتبطة بالنقر على الإعلان.

## 2026 content and attempt tracking

The simulator uses the published 1447/2026 Egypt Tourism Hajj allocation buckets and labels the computed figures as gross seat-to-applicant ratios rather than guaranteed individual odds. Seasonal administrative facts must be re-verified from authoritative sources before reuse in a future season.

### Email and attempt history

The current product allows open simulation attempts and records aggregate attempts/wins/losses per normalized email. During local development or on a static host without the API, persistence falls back to browser `localStorage`.

For production-grade cross-device persistence and consented lead storage, deploy on Cloudflare Pages with the included `functions/api/attempt.ts`, create a D1 database, run `migrations/0001_init.sql`, and bind the database as `hajj_lottery_db` (preferred). The function also accepts the legacy binding name `DB` for backward compatibility.

The optional marketing checkbox is separate from participation. Do not treat an email address as marketing consent unless the checkbox is enabled.

### Rewarded ad step

`AdSlot.tsx` may contain development/demo rewarded-ad UI. Replace any mock with a Google-approved Rewarded/Offerwall implementation only after AdSense approval and policy review. Never require clicking an advertisement itself, and do not describe a simulated countdown as a real ad impression.

### Editorial pages

The site includes expanded pages for the 2026 Egypt Tourism Hajj data, Hajj selection systems in other countries, and an evidence-based rituals guide anchored to Qur'an and authentic hadith references. Seasonal administrative facts should be re-verified every Hajj season.
