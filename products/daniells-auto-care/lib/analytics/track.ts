/**
 * Universal analytics framework adapter.
 *
 * The site emits only the framework's six custom event names. Native HTML is
 * the primary signal; existing data-track-* attributes are treated as
 * compatibility hints for component names and special cases.
 *
 * No form values, email addresses, phone numbers, query strings, or error
 * messages are sent to the data layer.
 */

export const CUSTOM_ANALYTICS_EVENTS = [
  'content_interaction',
  'navigation_interaction',
  'form_interaction',
  'error_interaction',
  'user_interaction',
  'feature_interaction',
] as const;

export type CustomAnalyticsEventName = (typeof CUSTOM_ANALYTICS_EVENTS)[number];

type AnalyticsValue = string | number | boolean | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

interface CommonEventParams extends AnalyticsParams {
  event_section: string;
}

export interface ContentInteractionParams extends CommonEventParams {
  interaction_type: string;
  click_text: string;
}

export interface NavigationInteractionParams extends CommonEventParams {
  interaction_type: 'link_click' | 'search' | 'external_link_click';
  click_text: string;
}

export interface FormInteractionParams extends CommonEventParams {
  interaction_type: 'form_submission';
  form_name: string;
  form_identifier: string;
  interaction_response?: 'successful' | 'failure';
  form_status?: 'started' | 'step_completed' | 'submitted' | 'successful' | 'failure';
}

export interface ErrorInteractionParams extends CommonEventParams {
  interaction_type: 'form_error' | 'spam_error' | 'page_error' | 'system_error' | 'payment_error' | 'rage_tap';
  error_name: string;
  error_type: string;
}

export interface UserInteractionParams extends CommonEventParams {
  interaction_type: 'authentication' | 'registration' | 'profile' | 'subscription' | 'billing' | 'team' | 'permission' | 'loyalty';
  account_action: string;
}

export interface FeatureInteractionParams extends CommonEventParams {
  interaction_type: 'resource_action' | 'feature_execution' | 'ai_interaction' | 'data_operation' | 'view_manipulation' | 'search' | 'gesture' | 'collaboration' | 'integration' | 'configuration' | 'automation' | 'experiment_exposure';
  feature_name: string;
  feature_action: string;
}

interface CustomEventParams {
  content_interaction: ContentInteractionParams;
  navigation_interaction: NavigationInteractionParams;
  form_interaction: FormInteractionParams;
  error_interaction: ErrorInteractionParams;
  user_interaction: UserInteractionParams;
  feature_interaction: FeatureInteractionParams;
}

export interface LeadFormAnalytics {
  form_type: 'quote' | 'contact' | 'lead';
  form_identifier: string;
  form_name: string;
  click_text: string;
  event_section: 'body' | 'popup_form';
}

export interface FormErrorAnalytics {
  interaction_type: 'form_error' | 'spam_error' | 'system_error';
  error_name: string;
  error_type: string;
  field_id?: string;
  error_count?: number;
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    __trackingInit?: boolean;
  }
}

const SCHEMA_VERSION = '2.0';
const SOCIAL_COMPONENTS = new Set([
  'facebook',
  'instagram',
  'linkedin',
  'tiktok',
  'twitter',
  'x',
  'youtube',
]);
const SECTION_VALUES = new Set([
  'header',
  'hero',
  'body',
  'footer',
  'sticky_bar',
  'popup_form',
  'sidebar',
  'banner',
  'checkout',
  'confirmation',
  'search_results',
  'account',
]);

const startedForms = new WeakSet<HTMLFormElement>();
const mediaMilestones = new WeakMap<HTMLMediaElement, Set<number>>();
const scrollMilestones = new Map<string, Set<number>>();
const pageErrors = new Set<string>();

function eventId(): string {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `evt_${id}`;
}

function safePageLocation(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}${window.location.pathname}`;
}

function pushDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!Array.isArray(window.dataLayer)) window.dataLayer = [];

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== '')
  );

  const eventPayload = {
    ...cleanPayload,
    event_id: eventId(),
    _schema_version: SCHEMA_VERSION,
    dispatch_source: 'client',
    page_location: safePageLocation(),
  };

  window.dataLayer.push(eventPayload);

  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics:event]', JSON.stringify(eventPayload));
  }
}

export function trackAnalyticsEvent<E extends CustomAnalyticsEventName>(
  event: E,
  params: CustomEventParams[E]
): void {
  pushDataLayer({ event, ...params });
}

export function trackLeadFormResult(
  form: LeadFormAnalytics,
  response: 'successful' | 'failure'
): void {
  trackAnalyticsEvent('form_interaction', {
    ...form,
    interaction_type: 'form_submission',
    interaction_response: response,
    form_status: response,
    event_tier: response === 'successful' ? '1_conversion' : '2_engagement',
  });

  if (response === 'successful') {
    pushDataLayer({
      event: 'generate_lead',
      form_identifier: form.form_identifier,
      lead_type: form.form_type,
      event_tier: '1_conversion',
    });
  }
}

export function trackLeadFormError(
  form: LeadFormAnalytics,
  error: FormErrorAnalytics
): void {
  trackLeadFormResult(form, 'failure');
  trackAnalyticsEvent('error_interaction', {
    event_section: form.event_section,
    form_identifier: form.form_identifier,
    interaction_type: error.interaction_type,
    error_name: error.error_name,
    error_type: error.error_type,
    field_id: error.field_id,
    error_count: error.error_count,
    event_tier: '3_diagnostic',
  });
}

function normalizedText(value: string | null | undefined, fallback: string): string {
  const text = value?.replace(/\s+/g, ' ').trim();
  return (text || fallback).slice(0, 120);
}

function componentName(el: HTMLElement): string | undefined {
  return el.dataset.trackLabel || el.dataset.attribute || el.id || undefined;
}

function eventSection(el: Element | null): string {
  if (!el) return 'body';

  const explicit = el.closest<HTMLElement>(
    '[data-analytics-section], [data-section], [data-attribute]'
  );
  const declared =
    explicit?.dataset.analyticsSection ||
    explicit?.dataset.section ||
    explicit?.dataset.attribute;
  if (declared && SECTION_VALUES.has(declared)) return declared;

  if (el.closest('[role="dialog"], dialog')) return 'popup_form';
  if (el.closest('header')) return 'header';
  if (el.closest('footer')) return 'footer';
  if (el.closest('aside')) return 'sidebar';
  return 'body';
}

function isInternalLink(anchor: HTMLAnchorElement): boolean {
  try {
    return new URL(anchor.href, window.location.href).origin === window.location.origin;
  } catch {
    return true;
  }
}

function safeLinkTarget(anchor: HTMLAnchorElement): string | undefined {
  try {
    const url = new URL(anchor.href, window.location.href);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    return url.origin === window.location.origin ? url.pathname : url.hostname;
  } catch {
    return undefined;
  }
}

function handleClick(event: MouseEvent): void {
  const target = event.target instanceof Element ? event.target : null;
  const el = target?.closest<HTMLElement>(
    'a, button, summary, [role="button"], [data-track-category]'
  );
  if (!el || el.matches(':disabled, [aria-disabled="true"]')) return;
  if (
    el instanceof HTMLFormElement ||
    target?.closest('input, select, textarea, label')
  ) {
    return;
  }

  const section = eventSection(el);
  const name = componentName(el);

  if (el instanceof HTMLAnchorElement) {
    const href = el.getAttribute('href') || '';

    if (href.startsWith('tel:')) {
      trackAnalyticsEvent('content_interaction', {
        interaction_type: 'phone_click',
        click_text: 'phone',
        event_section: section,
        component_name: name,
        component_type: 'link',
        event_tier: '1_conversion',
      });
      return;
    }

    if (href.startsWith('mailto:')) {
      trackAnalyticsEvent('content_interaction', {
        interaction_type: 'email_click',
        click_text: 'email',
        event_section: section,
        component_name: name,
        component_type: 'link',
        event_tier: '1_conversion',
      });
      return;
    }

    if (name === 'logo' || name?.startsWith('logo_')) {
      trackAnalyticsEvent('content_interaction', {
        interaction_type: 'logo_click',
        click_text: 'logo',
        event_section: section,
        component_name: name,
        component_type: 'link',
        event_tier: '2_engagement',
      });
      return;
    }

    if (name && SOCIAL_COMPONENTS.has(name.toLowerCase())) {
      trackAnalyticsEvent('content_interaction', {
        interaction_type: 'social_click',
        click_text: normalizedText(el.getAttribute('aria-label'), name),
        event_section: section,
        component_name: name,
        component_type: 'link',
        link_target: safeLinkTarget(el),
        event_tier: '2_engagement',
      });
      return;
    }

    const internal = isInternalLink(el);
    trackAnalyticsEvent('navigation_interaction', {
      interaction_type: internal ? 'link_click' : 'external_link_click',
      click_text: normalizedText(el.getAttribute('aria-label') || el.textContent, name || 'link'),
      event_section: section,
      component_name: name,
      component_type: 'link',
      source: internal ? 'internal_link' : undefined,
      link_target: safeLinkTarget(el),
      event_tier: '2_engagement',
    });
    return;
  }

  const form = el.closest('form');
  const buttonType =
    el instanceof HTMLButtonElement || el instanceof HTMLInputElement
      ? el.type
      : undefined;
  if (form && (buttonType === 'submit' || buttonType === 'reset')) return;

  const isAccordion =
    el.tagName === 'SUMMARY' ||
    el.hasAttribute('aria-expanded');

  trackAnalyticsEvent('content_interaction', {
    interaction_type: isAccordion ? 'accordion_click' : 'button_click',
    click_text: normalizedText(el.getAttribute('aria-label') || el.textContent, name || 'button'),
    event_section: section,
    component_name: name,
    component_type: el.dataset.attribute || el.tagName.toLowerCase(),
    interaction_status: isAccordion
      ? el.getAttribute('aria-expanded') === 'true'
        ? 'open'
        : 'close'
      : undefined,
    event_tier: '2_engagement',
  });
}

function formMetadata(form: HTMLFormElement): {
  form_type: string;
  form_identifier: string;
  form_name: string;
  event_section: string;
} {
  const legacyName = form.dataset.trackLabel;
  const identifier =
    form.id || legacyName || `form_${Array.from(document.forms).indexOf(form) + 1}`;
  const formType = form.dataset.attribute || legacyName?.replace(/_request$/, '') || 'contact';
  const formName = form.getAttribute('aria-label') || legacyName || identifier.replace(/[-_]/g, ' ');

  return {
    form_type: formType,
    form_identifier: identifier,
    form_name: formName,
    event_section: eventSection(form),
  };
}

function handleFormStart(event: FocusEvent): void {
  const field = event.target;
  if (
    !(field instanceof HTMLInputElement) &&
    !(field instanceof HTMLSelectElement) &&
    !(field instanceof HTMLTextAreaElement)
  ) {
    return;
  }
  if (field instanceof HTMLInputElement && field.type === 'hidden') return;
  if (field.name.startsWith('_')) return;

  const form = field.form;
  if (!form || startedForms.has(form)) return;
  startedForms.add(form);

  trackAnalyticsEvent('form_interaction', {
    ...formMetadata(form),
    interaction_type: 'form_submission',
    form_status: 'started',
    field_type: field instanceof HTMLInputElement ? field.type : field.tagName.toLowerCase(),
    field_name: field.name || field.id || 'unnamed_field',
    event_tier: '2_engagement',
  });
}

function handleSubmit(event: SubmitEvent): void {
  if (!(event.target instanceof HTMLFormElement)) return;
  const form = event.target;
  const submitter = event.submitter;

  trackAnalyticsEvent('form_interaction', {
    ...formMetadata(form),
    interaction_type: 'form_submission',
    form_status: 'submitted',
    click_text:
      submitter instanceof HTMLElement
        ? normalizedText(submitter.getAttribute('aria-label') || submitter.textContent, 'submit')
        : 'submit',
    event_tier: '2_engagement',
  });
}

function handleScroll(): void {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return;

  const percent = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
  const pageKey = window.location.pathname;
  const seen = scrollMilestones.get(pageKey) || new Set<number>();
  scrollMilestones.set(pageKey, seen);

  for (const milestone of [25, 50, 75, 100]) {
    if (percent < milestone || seen.has(milestone)) continue;
    seen.add(milestone);
    trackAnalyticsEvent('content_interaction', {
      interaction_type: 'scroll_milestone',
      click_text: 'scroll',
      event_section: 'body',
      scroll_percent: milestone,
      event_tier: milestone === 100 ? '2_engagement' : '3_diagnostic',
    });
  }
}

function mediaMetadata(
  media: HTMLMediaElement
): Pick<ContentInteractionParams, 'click_text' | 'event_section'> & AnalyticsParams {
  const title =
    media.getAttribute('aria-label') ||
    media.getAttribute('title') ||
    media.dataset.trackLabel ||
    media.tagName.toLowerCase();

  return {
    click_text: normalizedText(title, 'media'),
    event_section: eventSection(media),
    component_type: media.tagName.toLowerCase(),
    media_title: normalizedText(title, 'media'),
    media_duration: Number.isFinite(media.duration) ? Math.round(media.duration) : undefined,
  };
}

function handleMediaPlay(event: Event): void {
  if (!(event.target instanceof HTMLMediaElement)) return;
  trackAnalyticsEvent('content_interaction', {
    ...mediaMetadata(event.target),
    interaction_type: 'media_play',
    media_action: 'play',
    event_tier: '2_engagement',
  });
}

function handleMediaProgress(event: Event): void {
  const media = event.target;
  if (!(media instanceof HTMLVideoElement) || !Number.isFinite(media.duration) || media.duration <= 0) {
    return;
  }

  const percent = Math.round((media.currentTime / media.duration) * 100);
  const seen = mediaMilestones.get(media) || new Set<number>();
  mediaMilestones.set(media, seen);

  for (const milestone of [25, 50, 75, 90]) {
    if (percent < milestone || seen.has(milestone)) continue;
    seen.add(milestone);
    trackAnalyticsEvent('content_interaction', {
      ...mediaMetadata(media),
      interaction_type: 'video_progress',
      media_action: 'progress',
      video_percent: milestone,
      event_tier: '3_diagnostic',
    });
  }
}

function handleMediaComplete(event: Event): void {
  if (!(event.target instanceof HTMLMediaElement)) return;
  trackAnalyticsEvent('content_interaction', {
    ...mediaMetadata(event.target),
    interaction_type: event.target instanceof HTMLVideoElement ? 'video_complete' : 'media_play',
    media_action: 'complete',
    video_percent: event.target instanceof HTMLVideoElement ? 100 : undefined,
    event_tier: '2_engagement',
  });
}

function trackPageErrorIfPresent(): void {
  const marker = document.querySelector('[data-track-label="page_not_found"]');
  const pageKey = window.location.pathname;
  if (!marker || pageErrors.has(pageKey)) return;
  pageErrors.add(pageKey);

  trackAnalyticsEvent('error_interaction', {
    interaction_type: 'page_error',
    error_name: 'page_not_found',
    error_type: '404_not_found',
    event_section: 'body',
    event_tier: '3_diagnostic',
  });
}

function handleRuntimeError(event: ErrorEvent): void {
  if (!event.error) return;
  trackAnalyticsEvent('error_interaction', {
    interaction_type: 'system_error',
    error_name: 'uncaught_javascript_error',
    error_type: 'js_exception',
    event_section: 'body',
    event_tier: '3_diagnostic',
  });
}

function handleUnhandledRejection(): void {
  trackAnalyticsEvent('error_interaction', {
    interaction_type: 'system_error',
    error_name: 'unhandled_promise_rejection',
    error_type: 'js_exception',
    event_section: 'body',
    event_tier: '3_diagnostic',
  });
}

export function initTracking(): (() => void) | undefined {
  if (typeof window === 'undefined' || window.__trackingInit) return undefined;
  window.__trackingInit = true;

  let scrollFrame: number | null = null;
  const scheduleScroll = () => {
    if (scrollFrame !== null) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = null;
      handleScroll();
    });
  };

  const pageObserver = new MutationObserver(trackPageErrorIfPresent);

  document.addEventListener('click', handleClick, { passive: true });
  document.addEventListener('focusin', handleFormStart);
  document.addEventListener('submit', handleSubmit, true);
  document.addEventListener('play', handleMediaPlay, true);
  document.addEventListener('timeupdate', handleMediaProgress, true);
  document.addEventListener('ended', handleMediaComplete, true);
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('error', handleRuntimeError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  pageObserver.observe(document.body, { childList: true, subtree: true });

  trackPageErrorIfPresent();
  scheduleScroll();

  return () => {
    document.removeEventListener('click', handleClick);
    document.removeEventListener('focusin', handleFormStart);
    document.removeEventListener('submit', handleSubmit, true);
    document.removeEventListener('play', handleMediaPlay, true);
    document.removeEventListener('timeupdate', handleMediaProgress, true);
    document.removeEventListener('ended', handleMediaComplete, true);
    window.removeEventListener('scroll', scheduleScroll);
    window.removeEventListener('error', handleRuntimeError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    pageObserver.disconnect();
    if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
    window.__trackingInit = false;
  };
}
