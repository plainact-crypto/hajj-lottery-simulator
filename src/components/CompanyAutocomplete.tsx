import { useId, useMemo, useState } from 'react';
import { TOURISM_COMPANIES } from '../data/companies';

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CompanyAutocomplete({ value, onChange, error }: Props) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const normalized = value.trim().toLocaleLowerCase('ar');
  const matches = useMemo(() => TOURISM_COMPANIES.filter((company) => company.name.toLocaleLowerCase('ar').includes(normalized)).slice(0, 8), [normalized]);

  return (
    <div className="field autocomplete">
      <label htmlFor="company">شركة السياحة</label>
      <div className="input-wrap">
        <span aria-hidden="true">⌕</span>
        <input
          id="company"
          value={value}
          onChange={(event) => { onChange(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          placeholder="اكتب للبحث عن شركة"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'company-error' : 'company-hint'}
        />
      </div>
      <small id="company-hint">الأسماء الحالية أمثلة لتجربة الواجهة وليست قائمة اعتماد رسمية.</small>
      {error && <span className="field-error" id="company-error">{error}</span>}
      {open && (
        <ul className="suggestions" id={listId} role="listbox">
          {matches.length ? matches.map((company) => (
            <li key={company.id}>
              <button type="button" role="option" aria-selected={value === company.name} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(company.name); setOpen(false); }}>
                {company.name}
              </button>
            </li>
          )) : <li className="no-results">لا توجد شركة مطابقة ضمن القائمة التجريبية</li>}
        </ul>
      )}
    </div>
  );
}
