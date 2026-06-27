"use client";

import { useEffect } from "react";
import { exactTranslations, localeCookieName, phraseTranslations, type SiteLocale } from "@/lib/i18n";

const originalText = new WeakMap<Text, string>();
const phraseEntries = Object.entries(phraseTranslations).sort((a, b) => b[0].length - a[0].length);

export function LanguageRuntime() {
  useEffect(() => {
    let locale = readStoredLocale();
    let observer: MutationObserver | null = null;

    const apply = () => {
      document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
      document.documentElement.dataset.locale = locale;
      translateDocument(locale);
    };

    const onLocaleChange = (event: Event) => {
      const next = (event as CustomEvent<SiteLocale>).detail;
      locale = next === "en" ? "en" : "zh";
      apply();
    };

    apply();
    window.addEventListener("site-locale-change", onLocaleChange);

    observer = new MutationObserver(() => {
      if (locale === "en") {
        translateDocument(locale);
      }
    });
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("site-locale-change", onLocaleChange);
      observer?.disconnect();
    };
  }, []);

  return null;
}

function readStoredLocale(): SiteLocale {
  if (typeof window === "undefined") return "zh";
  const stored = window.localStorage.getItem(localeCookieName);
  if (stored === "en" || stored === "zh") return stored;
  const cookieValue = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${localeCookieName}=`))
    ?.split("=")[1];
  return cookieValue === "en" ? "en" : "zh";
}

function translateDocument(locale: SiteLocale) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-no-i18n], script, style, textarea, input, select, code, pre")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }

  nodes.forEach((node) => translateTextNode(node, locale));
}

function translateTextNode(node: Text, locale: SiteLocale) {
  if (locale === "zh") {
    const original = originalText.get(node);
    if (original !== undefined && node.nodeValue !== original) {
      node.nodeValue = original;
    }
    return;
  }

  const current = node.nodeValue ?? "";
  const previousOriginal = originalText.get(node);
  const previousTranslation = previousOriginal ? translateText(previousOriginal) : null;
  const base = previousOriginal && current === previousTranslation ? previousOriginal : current;
  originalText.set(node, base);
  const translated = translateText(base);
  if (translated !== current) {
    node.nodeValue = translated;
  }
}

function translateText(value: string) {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const trimmed = value.trim();
  const exact = exactTranslations[trimmed];
  if (exact) return `${leading}${exact}${trailing}`;

  return phraseEntries.reduce((result, [zh, en]) => result.replaceAll(zh, en), value);
}
