<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:i18n-rules -->
# i18n rules

- Routes live under `app/[locale]`; keep API routes outside locale routing.
- Use `localePrefix: "as-needed"`: default `id` stays unprefixed, `en` uses `/en`.
- Use `@/i18n/navigation` for internal `Link`, `useRouter`, and `usePathname`.
- Do not pass full locale JSON to `NextIntlClientProvider`.
- Load only needed namespaces with `getNamespaceMessages()` from `@/i18n/messages`.
- Add new translations as split files under `i18n/messages/{locale}/{namespace}.json` and update `i18n/messages.ts` loaders.
- Server pages should read namespace objects directly, not call `getMessages()` or `getTranslations()` unless truly needed.
- Client providers should be route-specific and only include messages used by that route.
<!-- END:i18n-rules -->
