import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const money = new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 });

export function ToolsHubPage() {
  const tools = [
    ['/tools/hajj-packing-checklist','قائمة تجهيز شنطة الحج','قائمة تفاعلية تحفظ تقدمك على جهازك بدون بيانات شخصية.'],
    ['/tools/hajj-budget-calculator','حاسبة ميزانية الحج','اجمع تكاليف البرنامج والسفر والمصروف والطوارئ من أرقامك أنت.'],
    ['/tools/egypt-hajj-eligibility-checker','فاحص جاهزية التقديم للحج في مصر','فحص تمهيدي يساعدك تعرف ما الذي يجب التحقق منه رسميًا قبل التقديم.'],
    ['/tools/hajj-program-comparison','مقارنة برامج الحج','قارن عرضين على السعر والسكن والنقل والخدمات بدل الاعتماد على اسم الفئة فقط.'],
    ['/umrah-1448-checker','فاحص برنامج العمرة 1448','راجع أهم عناصر برنامج العمرة وفق الضوابط الموسمية المعلنة.'],
  ] as const;
  return <div className="page-container content-page"><section className="hero"><span className="unofficial-badge">أدوات مستقلة غير رسمية</span><h1>أدوات الحج والعمرة</h1><p>أدوات عملية تساعدك على التنظيم والمقارنة والفحص قبل اتخاذ قرار أو الرجوع للمصدر الرسمي.</p></section><div className="tool-grid">{tools.map(([to,title,desc])=><Link className="tool-card card" to={to} key={to}><strong>{title}</strong><span>{desc}</span><b>فتح الأداة ←</b></Link>)}</div><div className="inline-notice"><strong>حدود الأدوات</strong><p>لا توجد أداة هنا تسجل طلب حج أو تصدر نتيجة أو اعتمادًا رسميًا. المعلومات الموسمية يجب التحقق منها من الجهة المختصة قبل السداد أو التقديم.</p></div></div>;
}

const packingGroups = [
  ['المستندات',['جواز السفر','نسخ ورقية ورقمية من المستندات','بيانات البرنامج والسكن','وسيلة دفع احتياطية']],
  ['الملابس',['ملابس مناسبة للطقس','ملابس داخلية إضافية','جوارب مريحة','حذاء مريح للمشي']],
  ['الصحة',['الأدوية الشخصية بوصفاتها عند الحاجة','واقي شمس','كمامات ومناديل','زجاجة مياه قابلة لإعادة الاستخدام']],
  ['التقنية والتنظيم',['شاحن الهاتف','باور بانك مسموح بالطيران','نسخة من أرقام الطوارئ','حقيبة صغيرة يومية']],
] as const;
export function PackingChecklistPage(){
  const items=packingGroups.flatMap(([,xs])=>xs); const [checked,setChecked]=useState<Record<string,boolean>>(()=>{try{return JSON.parse(localStorage.getItem('hajjPacking')||'{}')}catch{return {}}});
  const done=items.filter(x=>checked[x]).length; const toggle=(x:string)=>{const next={...checked,[x]:!checked[x]};setChecked(next);localStorage.setItem('hajjPacking',JSON.stringify(next));};
  return <ToolShell title="قائمة تجهيز شنطة الحج" intro="قائمة عملية قابلة للتعديل ذهنيًا حسب حالتك وبرنامجك. يتم حفظ العلامات محليًا على جهازك فقط."><div className="tool-progress"><strong>{done} / {items.length}</strong><span>تم تجهيزها</span><progress value={done} max={items.length}/></div>{packingGroups.map(([g,xs])=><section className="tool-section card" key={g}><h2>{g}</h2>{xs.map(x=><label className="check-row" key={x}><input type="checkbox" checked={Boolean(checked[x])} onChange={()=>toggle(x)}/><span>{x}</span></label>)}</section>)}<button className="button button-support" onClick={()=>{setChecked({});localStorage.removeItem('hajjPacking')}}>إعادة ضبط القائمة</button></ToolShell>;
}

export function BudgetCalculatorPage(){
  const [v,setV]=useState({program:'',transport:'',documents:'',personal:'',emergency:'10'}); const num=(k:keyof typeof v)=>Number(v[k])||0; const base=num('program')+num('transport')+num('documents')+num('personal'); const pct=Math.max(0,num('emergency')); const total=base*(1+pct/100);
  return <ToolShell title="حاسبة ميزانية الحج" intro="الحاسبة لا تعرض سعرًا رسميًا؛ أدخل الأرقام الفعلية من العرض الذي أمامك لتقدير إجمالي الميزانية."><form className="simulator-form card"><MoneyField id="program" label="سعر البرنامج / الباقة" value={v.program} set={(x)=>setV({...v,program:x})}/><MoneyField id="transport" label="تنقلات ومصاريف سفر إضافية" value={v.transport} set={(x)=>setV({...v,transport:x})}/><MoneyField id="documents" label="مستندات ورسوم أخرى معلومة" value={v.documents} set={(x)=>setV({...v,documents:x})}/><MoneyField id="personal" label="مصروف شخصي متوقع" value={v.personal} set={(x)=>setV({...v,personal:x})}/><div className="field"><label htmlFor="emergency">احتياطي طوارئ %</label><div className="input-wrap"><input id="emergency" type="number" min="0" max="100" value={v.emergency} onChange={e=>setV({...v,emergency:e.target.value})}/></div></div></form><div className="result-card card"><span className="result-label">التقدير</span><h2>{money.format(total)} جنيه</h2><p>الأساس: {money.format(base)} جنيه + احتياطي {pct}%.</p><small>استخدم هذا الرقم للتخطيط فقط، وليس كسعر معلن أو عرض ملزم.</small></div></ToolShell>;
}

export function EligibilityCheckerPage(){
  const [answers,setAnswers]=useState<Record<string,string>>({}); const qs=[['route','هل حددت مسار التقديم: قرعة / جمعيات / سياحي؟'],['official','هل راجعت شروط الموسم الحالي من الجهة الرسمية لهذا المسار؟'],['docs','هل مستنداتك الأساسية سارية وجاهزة؟'],['prior','هل تحققت من شرط سابقة الحج إن كان مطبقًا على مسارك؟'],['health','هل راجعت الاشتراطات الصحية الحالية المطلوبة للموسم؟']]; const missing=qs.filter(([k])=>answers[k]!=='yes');
  return <ToolShell title="فاحص جاهزية التقديم للحج في مصر" intro="فحص تمهيدي غير ملزم. لا يحكم على أهليتك القانونية؛ هدفه كشف النقاط التي ما زالت تحتاج تحققًا رسميًا."><section className="simulator-form card">{qs.map(([k,q])=><div className="field" key={k}><label htmlFor={k}>{q}</label><div className="input-wrap select-wrap"><select id={k} value={answers[k]||'unknown'} onChange={e=>setAnswers({...answers,[k]:e.target.value})}><option value="unknown">غير متأكد</option><option value="yes">نعم</option><option value="no">لا</option></select></div></div>)}</section><div className="result-card card"><span className="result-label">النتيجة التمهيدية</span><h2>{missing.length===0?'جاهز للتحقق النهائي':'ما زالت هناك نقاط تحتاج مراجعة'}</h2><p>{missing.length===0?'راجعت العناصر الأساسية. قبل التقديم نفّذ التحقق النهائي من الجهة الرسمية لمسارك.':`لديك ${missing.length} نقطة غير محسومة. لا تعتمد على الأداة كإثبات أهلية.`}</p><Link className="button button-primary" to="/egypt-hajj/2027">افتح دليل حج مصر 2027</Link></div></ToolShell>;
}

export function ProgramComparisonPage(){
  const blank={name:'',price:'',makkah:'',madinah:'',transport:'',meals:'',notes:''}; const [a,setA]=useState({...blank,name:'العرض الأول'});const[b,setB]=useState({...blank,name:'العرض الثاني'}); const score=(x:typeof blank)=>[x.makkah,x.madinah,x.transport,x.meals].filter(Boolean).length;
  return <ToolShell title="مقارنة برامج الحج" intro="قارن العرضين على عناصر قابلة للفحص. الأداة لا ترتب الشركات ولا توصي بمقدم خدمة."><div className="compare-tools-grid"><ProgramForm value={a} set={setA}/><ProgramForm value={b} set={setB}/></div><div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th>العنصر</th><th>{a.name}</th><th>{b.name}</th></tr></thead><tbody><tr><td>السعر المدخل</td><td>{a.price||'—'}</td><td>{b.price||'—'}</td></tr><tr><td>سكن مكة</td><td>{a.makkah||'—'}</td><td>{b.makkah||'—'}</td></tr><tr><td>سكن المدينة</td><td>{a.madinah||'—'}</td><td>{b.madinah||'—'}</td></tr><tr><td>النقل</td><td>{a.transport||'—'}</td><td>{b.transport||'—'}</td></tr><tr><td>الوجبات</td><td>{a.meals||'—'}</td><td>{b.meals||'—'}</td></tr><tr><td>اكتمال البيانات</td><td>{score(a)}/4</td><td>{score(b)}/4</td></tr></tbody></table></div><div className="inline-notice"><strong>لا تختار بالسعر وحده</strong><p>تحقق من اسم الفندق وموقعه الفعلي، النقل، مدة الإقامة، الخدمات المكتوبة بالعقد، وسياسة التعديل أو الإلغاء قبل أي دفع.</p></div></ToolShell>;
}

function ProgramForm({value,set}:{value:any,set:(x:any)=>void}){return <section className="tool-section card"><div className="field"><label>اسم العرض</label><div className="input-wrap"><input value={value.name} onChange={e=>set({...value,name:e.target.value})}/></div></div>{[['price','السعر'],['makkah','سكن مكة / المسافة'],['madinah','سكن المدينة / المسافة'],['transport','النقل'],['meals','الوجبات']].map(([k,l])=><div className="field" key={k}><label>{l}</label><div className="input-wrap"><input value={value[k]} onChange={e=>set({...value,[k]:e.target.value})}/></div></div>)}</section>}
function MoneyField({id,label,value,set}:{id:string,label:string,value:string,set:(x:string)=>void}){return <div className="field"><label htmlFor={id}>{label}</label><div className="input-wrap"><input id={id} type="number" min="0" inputMode="decimal" value={value} onChange={e=>set(e.target.value)} placeholder="0"/></div></div>}
function ToolShell({title,intro,children}:{title:string,intro:string,children:any}){return <div className="page-container content-page"><section className="hero"><span className="unofficial-badge">أداة مستقلة غير رسمية</span><h1>{title}</h1><p>{intro}</p></section>{children}<p className="tool-back"><Link to="/tools">← كل الأدوات</Link></p></div>}
