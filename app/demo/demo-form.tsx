'use client';

import { NewTabCue } from '@/components/new-tab-cue';
import { useActionState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { countries } from '@/content/countries';
import { products } from '@/content/products';
import { whatsappLink } from '@/content/site';
import { LEAD_MAX, type FormValues, type LeadResult } from '@/lib/lead';
import { requestDemo } from './actions';

const input =
  'mt-1 block w-full min-h-11 rounded-control border border-ink-muted bg-white px-3 text-16 text-ink aria-[invalid=true]:border-[#b42318]';
const label = 'font-display text-16 font-bold text-navy';
const err = 'mt-1 text-14 text-[#b42318]';

export function DemoForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState<LeadResult, FormData>(requestDemo, { status: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLParagraphElement>(null);

  // Move focus to the first invalid field after a failed validation, and to the confirmation once sent.
  useEffect(() => {
    if (state.status === 'invalid') {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    } else if (state.status === 'sent') {
      sentRef.current?.focus();
    } else if (state.status === 'failed' || state.status === 'rate-limited') {
      alertRef.current?.focus();
    }
  }, [state]);

  if (state.status === 'sent') {
    return (
      <div ref={sentRef} tabIndex={-1} role="status" className="rounded-panel border border-line bg-white p-6">
        <h2 className="text-25">Thank you. Your request was sent.</h2>
        <p className="mt-2 text-16 text-ink-muted">We&apos;ll contact you within one working day.</p>
        <a
          href={whatsappLink('Hello ILACORE, I just requested a demo.')}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center rounded-control bg-gold px-5 font-display font-bold text-navy-deep"
        >
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  const values: FormValues = 'values' in state ? state.values : {};
  const errors = state.status === 'invalid' ? state.fieldErrors : {};
  const preselected = params.get('product');
  const checked = (slug: string) => (Array.isArray(values.products) ? values.products.includes(slug) : preselected === slug);
  const v = (k: string) => (typeof values[k] === 'string' ? (values[k] as string) : '');
  // Remount the form when the server returns values, so defaultValue and defaultChecked apply.
  const formKey = JSON.stringify(values);

  return (
    <form ref={formRef} key={formKey} action={action} noValidate className="relative min-w-0 space-y-6">
      {state.status === 'failed' && (
        <p ref={alertRef} tabIndex={-1} role="alert" className="rounded-panel border border-[#b42318] bg-white p-4 text-16 text-ink">
          Your request didn&apos;t send. Message us on WhatsApp or try again.{' '}
          <a className="font-bold text-navy underline" href={whatsappLink('Hello ILACORE, I would like a demo.')} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          <NewTabCue /></a>
        </p>
      )}
      {state.status === 'rate-limited' && (
        <p ref={alertRef} tabIndex={-1} role="alert" className="rounded-panel border border-[#b42318] bg-white p-4 text-16 text-ink">
          Too many attempts. Try again in a few minutes, or message us on WhatsApp.{' '}
          <a className="font-bold text-navy underline" href={whatsappLink('Hello ILACORE, I would like a demo.')} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          <NewTabCue /></a>
        </p>
      )}

      {(
        [
          ['name', 'Name', 'name'],
          ['company', 'Company', 'organization'],
        ] as const
      ).map(([field, text, auto]) => (
        <div key={field}>
          <label htmlFor={field} className={label}>{text}</label>
          <input
            id={field}
            name={field}
            autoComplete={auto}
            required
            maxLength={LEAD_MAX[field]}
            defaultValue={v(field)}
            aria-invalid={!!errors[field]}
            aria-describedby={errors[field] ? `${field}-error` : undefined}
            className={input}
          />
          {errors[field] && <p id={`${field}-error`} className={err}>{errors[field]}</p>}
        </div>
      ))}

      <div>
        <label htmlFor="country" className={label}>Country</label>
        <select
          id="country"
          name="country"
          required
          defaultValue={v('country')}
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? 'country-error' : undefined}
          className={input}
        >
          <option value="">Choose a country</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.country && <p id="country-error" className={err}>{errors.country}</p>}
      </div>

      <div>
        <label htmlFor="phone" className={label}>Phone or WhatsApp</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          maxLength={LEAD_MAX.phone}
          placeholder="+254 712 345 678"
          defaultValue={v('phone')}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          className={input}
        />
        {errors.phone && <p id="phone-error" className={err}>{errors.phone}</p>}
      </div>

      <fieldset aria-describedby={errors.products ? 'products-error' : undefined}>
        <legend className={label}>Products</legend>
        <div className="mt-2 space-y-2">
          {products.map((p, i) => (
            <label key={p.slug} className="flex min-h-11 items-center gap-3 text-16">
              <input
                type="checkbox"
                name="products"
                value={p.slug}
                defaultChecked={checked(p.slug)}
                aria-invalid={i === 0 && !!errors.products ? true : undefined}
                className="h-5 w-5 accent-navy"
              />
              {p.name}
              {p.status === 'coming-soon' && <span className="text-14 text-ink-muted">(coming soon)</span>}
            </label>
          ))}
        </div>
        {errors.products && <p id="products-error" className={err}>{errors.products}</p>}
      </fieldset>

      <div>
        <label htmlFor="size" className={label}>
          Fleet or station size <span className="font-body font-normal text-ink-muted">(optional)</span>
        </label>
        <input
          id="size"
          name="size"
          maxLength={LEAD_MAX.size}
          placeholder="For example: 12 stations, or 40 trucks"
          defaultValue={v('size')}
          aria-invalid={!!errors.size}
          aria-describedby={errors.size ? 'size-error' : undefined}
          className={input}
        />
        {errors.size && <p id="size-error" className={err}>{errors.size}</p>}
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center rounded-control bg-gold px-6 font-display text-16 font-bold text-navy-deep disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Request a demo'}
      </button>
    </form>
  );
}
