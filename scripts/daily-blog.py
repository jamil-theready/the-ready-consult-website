#!/usr/bin/env python3
"""Daily blog generator for The Ready Consult.

Picks a high-priority topic, calls Gemini with the full TRC brand-voice
system prompt, validates the output, and writes a new markdown file to
content/blog/. GitHub Actions handles the commit + push.

Ported from n8n 'TRC — Daily Blog' (2026-05-18).
"""

import json
import os
import random
import re
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT / "content" / "blog"
IMAGE_LIBRARY_DIR = ROOT / "public" / "blog" / "library"
CONTEXT_PATH = ROOT / ".seo" / "context.json"
LINKS_PATH = ROOT / ".seo" / "internal-links.json"

GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

SHEET_ID = "1KsgGS2xMUju6OJozv5RSHXKshZPcxK4OsoaUivKyA60"
SHEET_TAB = "posted_content_log"
SITE_BASE = "https://www.thereadyconsult.com"

AUTHORS = ["Jamil Gonzales", "Shawn Reddy"]

CATEGORY_TARGETS = {
    "AI Workflows": 0.25,
    "Growth Experiments": 0.20,
    "Content Systems": 0.20,
    "Paid Media": 0.15,
    "SEO & AEO": 0.15,
    "Operating Playbooks": 0.05,
}

CLUSTER_KEYWORDS = {
    "AI Workflows": [
        "n8n automation b2b",
        "ai content workflow",
        "marketing automation framework",
        "ai agent orchestration",
        "workflow templates n8n",
        "ai content qa system",
    ],
    "Growth Experiments": [
        "72 hour test loop marketing",
        "growth experiment framework",
        "b2b ab testing playbook",
        "paid ads creative testing",
        "funnel optimization saas",
        "growth audit b2b",
    ],
    "Content Systems": [
        "content engine setup",
        "content repurposing workflow",
        "blog automation system",
        "content distribution playbook",
        "content kpis b2b",
        "editorial calendar saas",
    ],
    "Paid Media": [
        "meta ads b2b strategy",
        "linkedin ads playbook",
        "google ads roas optimization",
        "paid social benchmarks 2026",
        "retargeting strategy b2b",
        "ad creative ugc b2b",
    ],
    "SEO & AEO": [
        "aeo strategy 2026",
        "answer engine optimization",
        "geo content optimization",
        "seo content brief template",
        "google sge optimization",
        "schema markup blog",
    ],
    "Operating Playbooks": [
        "fractional cmo guide",
        "agency vs in house marketing",
        "marketing org design b2b",
        "rev ops framework",
        "marketing tech stack b2b",
        "growth team hiring",
    ],
}

SEASONAL = {
    1: ["ai marketing planning 2026", "annual content calendar template", "q1 paid ads benchmarks", "growth okrs framework"],
    2: ["ai content engine setup", "b2b cold outreach 2026", "aeo strategy for saas", "linkedin newsletter playbook"],
    3: ["saas pipeline review framework", "content engine kpis", "q1 retrospective marketing", "google search console wins"],
    4: ["ai workflow audit b2b", "q2 paid media reset", "seo content brief template", "fractional cmo evaluation"],
    5: ["ai agency operations 2026", "content repurposing system", "growth experiments framework", "meta ads creative refresh"],
    6: ["mid year marketing review", "ai content qa playbook", "linkedin growth strategy 2026", "organic vs paid mix b2b"],
    7: ["n8n workflow examples", "sales enablement content", "aeo for ai search", "agency client onboarding flow"],
    8: ["back to school b2b marketing", "content engine roi calc", "q3 paid ads benchmarks", "crm cleanup playbook"],
    9: ["q4 planning b2b", "content systems audit", "ai chatbot for marketing", "seo content gap analysis"],
    10: ["marketing budget season", "black friday b2b playbook", "ai sdr workflows", "annual content review"],
    11: ["year end paid ads optimization", "ai marketing trends 2027", "content engine handoff", "agency selection guide"],
    12: ["ai marketing trends 2027", "year end growth retrospective", "q1 planning framework", "content roadmap template"],
}


def slugify(s: str) -> str:
    s = re.sub(r"[^a-z0-9\s-]", "", s.lower())
    s = re.sub(r"\s+", "-", s).strip("-")
    return "-".join(s.split("-")[:6])


def existing_slugs() -> set[str]:
    return {f.stem for f in BLOG_DIR.glob("*.md")}


def existing_image_paths() -> list[str]:
    if not IMAGE_LIBRARY_DIR.exists():
        return []
    return [f"/blog/library/{f.name}" for f in IMAGE_LIBRARY_DIR.glob("*") if f.is_file()]


def pick_image() -> str:
    images = existing_image_paths()
    return random.choice(images) if images else ""


def pick_keyword(used: set[str]) -> tuple[str, str, str]:
    """Returns (keyword, source, category). Category is the cluster the keyword came from."""
    candidates: list[tuple[str, str, str, int]] = []
    for category, kws in CLUSTER_KEYWORDS.items():
        for kw in kws:
            candidates.append((kw, "cluster-" + category.lower().replace(" & ", "-").replace(" ", "-"), category, 10))

    month = datetime.now().month
    for kw in SEASONAL.get(month, []):
        # Map seasonal back to a reasonable category — default AI Workflows
        candidates.append((kw, "seasonal", _guess_category(kw), 4))

    fresh = [c for c in candidates if slugify(c[0]) not in used]
    if not fresh:
        fresh = [("ai content engine for b2b saas", "fallback", "AI Workflows", 0)]

    fresh.sort(key=lambda c: c[3], reverse=True)
    top = fresh[:8]
    chosen = random.choice(top)
    return chosen[0], chosen[1], chosen[2]


def _guess_category(keyword: str) -> str:
    """Crude keyword-to-category mapping for seasonal pool."""
    kw = keyword.lower()
    if any(t in kw for t in ["ai ", "n8n", "workflow", "automation", "agent"]):
        return "AI Workflows"
    if any(t in kw for t in ["paid", "meta ads", "linkedin ads", "google ads", "ugc"]):
        return "Paid Media"
    if any(t in kw for t in ["seo", "aeo", "geo", "sge", "schema", "search console"]):
        return "SEO & AEO"
    if any(t in kw for t in ["content engine", "editorial", "content roadmap", "content calendar", "content kpis", "repurp"]):
        return "Content Systems"
    if any(t in kw for t in ["okr", "fractional", "agency", "rev ops", "hiring", "org design", "stack"]):
        return "Operating Playbooks"
    return "Growth Experiments"


def build_system_prompt() -> str:
    return """# The Ready Consult — Daily Blog Content Engine

You write SEO/GEO/AEO-optimized blog posts for thereadyconsult.com. Your ONLY output is a single blog post markdown file with YAML frontmatter. Do NOT generate LinkedIn, Facebook, or GBP posts — those are separate flows.

## About The Ready Consult

- AI-first growth and media agency
- Founded by Jamil Gonzales (CEO & Growth Strategist) and Shawn Reddy (Co-Founder & AI Architect)
- We build content engines, paid-ad systems, and growth operations for $1M–$20M companies
- Six editorial lanes: AI Workflows, Growth Experiments, Content Systems, Paid Media, SEO & AEO, Operating Playbooks
- Website: https://www.thereadyconsult.com
- Contact: team@thereadyconsult.com

## Hard rules — violating means automatic rejection

1. NEVER mention pricing, dollar amounts for our services, packages, tiers, or "starting at $X." The Ready Consult is conversation-gated. Pricing is decided live on calls, NEVER in public content. Do not write phrases like "our $100/mo plan" or "three packages." This is absolute.
2. NEVER use the words: "package," "plan," "tier," "starting at," when describing TRC's offers in a way that could imply pricing.
3. NEVER write filler phrases: "in today's world," "whether you're," "let's dive in," "in conclusion," "when it comes to," "navigating," "at the end of the day," "first and foremost," "in this article we'll explore."
4. NEVER use em dashes or hyphens for ranges. Use "to" instead: "5 to 10 days," not "5-10 days."
5. NO emojis in the body.
6. Max 1 exclamation mark in the entire post.
7. Active voice always. Specific beats vague. Concrete numbers over abstractions.
8. NEVER use "click here" or "learn more" as anchor text.

## Voice rules

- First person plural ("we") from The Ready Consult perspective, OR first person singular ("I") when the post is from one of the founders.
- Direct, operator-to-operator tone. We talk to founders and growth leads, not marketing tourists.
- Short punchy sentences. Vary length. Confident, never salesy.
- Specific > vague. Numbers > adjectives. Worked-examples > frameworks.

## SEO / GEO / AEO requirements (HARD)

Every H1 and every H2 must be optimized for all three:
- **SEO** — keyword-anchored, ranks for a real long-tail search query
- **GEO (Generative Engine Optimization)** — phrased as a complete idea an LLM can quote in isolation
- **AEO (Answer Engine Optimization)** — at least HALF the H2s must be QUESTIONS

H2s like "Why we started this" or "What's next" fail all three. Reject and rewrite.

## GEO citation patterns (REQUIRED — these are what AI engines actually cite)

EVERY post must include AT LEAST 4 of these 6:

1. **Definitive single-sentence answer** in the first 100 words. Format: "[X] is [definition with specific noun phrase]." Bold this sentence.
2. **A comparison table.** Markdown table with minimum 3 rows, 3 columns. NEVER skip if the topic involves choosing between options.
3. **At least 3 named-entity stats** with explicit source. Format: "According to [Source, Date], [stat]."
4. **A "TL;DR" or "Quick verdict" callout** near the top (in addition to quickAnswer frontmatter). 2-3 sentences. Use a markdown blockquote or bold lead.
5. **Date anchors.** Sprinkle "as of [Month YYYY]" or "[Current Year]" at least 3 times in the body.
6. **A numbered framework or step list** (3-7 items) with the framework's NAME bolded.

If the topic doesn't naturally support a comparison table, skip #2 but pick 4 of the remaining 5. Never drop below 4 GEO patterns total.

## Output Format (REQUIRED)

Output ONE markdown file starting IMMEDIATELY with YAML frontmatter (do NOT wrap in code fences):

---
title: "..." (50-65 chars, primary keyword in first 5 words)
metaTitle: "... (2026)" (50-65 chars, ends with year)
metaDescription: "..." (140-160 chars, includes keyword and value prop)
slug: "..." (4-6 lowercase hyphenated words)
date: "YYYY-MM-DD"
image: "<INJECTED_IMAGE_PATH>"
imageAlt: "..." (10-125 chars, topic-specific, NOT photo-content)
category: "AI Workflows" OR "Growth Experiments" OR "Content Systems" OR "Operating Playbooks" OR "Paid Media" OR "SEO & AEO"
author: "Jamil Gonzales" OR "Shawn Reddy"
tags: ["tag1","tag2","tag3","tag4"]
language: "en"
featured: false
draft: false
quickAnswer: "..." (140-280 chars, direct answer)
keyTakeaways:
  - "..." (4 items, 15-25 words each, at least 2 with specific numbers)
  - "..."
  - "..."
  - "..."
faqTitle: "Frequently Asked Questions"
faq:
  - question: "..."
    answer: "..." (MINIMUM 6 FAQs. Real long-tail queries. Answers 80-280 chars, self-contained.)
  - question: "..."
    answer: "..."
  - question: "..."
    answer: "..."
  - question: "..."
    answer: "..."
  - question: "..."
    answer: "..."
  - question: "..."
    answer: "..."
---

[Body content. 1000-1800 words. 5-9 H2 headings, at least HALF as questions.]

**Markdown heading rules — STRICT:**
- All body section headings MUST use H2 (`## Heading`), NOT H3 (`### Heading`).
- Use H3 (`###`) ONLY for sub-headings *inside* an H2 section.
- The TL;DR callout is NOT an H2; use bold text or a blockquote, not a heading.

## Body requirements

- Word count: 1000 to 1800 words
- H2 headings (`## ...`): 5 to 9. At least half phrased as questions
- Internal links: minimum 3 to TRC pages
- Outbound authority links: minimum 2 to .gov, .edu, .org, or recognized industry source
- Include at least 1 concrete number/stat per H2 section
- Include at least 1 worked example or specific tactic readers can copy
- End with a CTA linking to /contact for a discovery call. NEVER include prices in the CTA

## Internal Link Library

- [The Field Notes](/blog) — cross-links to other posts
- [Book a discovery call](/contact) — for CTAs
- [Our services](/#services) — capability references
- [How we work](/#how-it-works) — process references
- [About The Ready Consult](/#about) — founder context

Format: [descriptive anchor text](/path/). Anchor text must be specific.

## Self-check before output

Verify every rule. If any fail, fix before returning."""


def build_user_prompt(keyword: str, category: str, source: str, author: str, image_path: str) -> str:
    today = datetime.now().strftime("%Y-%m-%d")
    return f"""Today's date is {today}.

TARGETED KEYWORD: {keyword}
CONTENT CATEGORY: {category}
KEYWORD SOURCE: {source}
ASSIGNED AUTHOR: {author}
COVER IMAGE PATH: {image_path}

Write a comprehensive blog post targeting this keyword for The Ready Consult. Apply all voice rules, SEO/GEO/AEO requirements, and GEO citation patterns from the system prompt.

The frontmatter author field MUST be exactly: {author}
The frontmatter category field MUST be exactly: {category}
The frontmatter image field MUST be exactly: {image_path}
The frontmatter imageAlt MUST be topic-specific (not photo-content), 10-125 chars.

Output only the blog post markdown file starting with --- YAML frontmatter. No other deliverables."""


def call_gemini(system_prompt: str, user_prompt: str, api_key: str) -> str:
    body = {
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 8192},
    }
    url = f"{GEMINI_URL}?key={api_key}"
    data = json.dumps(body).encode()
    last_err = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(
                url, data=data, headers={"Content-Type": "application/json"}, method="POST"
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                payload = json.loads(resp.read())
                return payload["candidates"][0]["content"]["parts"][0]["text"]
        except (urllib.error.URLError, urllib.error.HTTPError, KeyError, IndexError) as e:
            last_err = e
            print(f"Gemini attempt {attempt + 1} failed: {e}", file=sys.stderr)
            if attempt < 2:
                time.sleep(30)
    raise RuntimeError(f"Gemini failed after 3 attempts: {last_err}")


def extract_field(fm: str, name: str) -> str:
    m = re.search(rf'^{name}:\s*"([^"]+)"', fm, re.MULTILINE)
    return m.group(1) if m else ""


def validate_and_extract(text: str) -> tuple[str, str]:
    text = re.sub(r"^```(?:yaml|markdown|md)?\n", "", text.strip())
    text = re.sub(r"\n```\s*$", "", text)

    fm_match = re.match(r"^---\n([\s\S]*?)\n---", text)
    if not fm_match:
        raise ValueError("Output missing YAML frontmatter")

    fm = fm_match.group(1)
    body = text[len(fm_match.group(0)):].strip()

    for f in ["title", "slug", "date", "quickAnswer", "category", "author", "image"]:
        if not extract_field(fm, f):
            raise ValueError(f"Missing required frontmatter field: {f}")

    word_count = len(re.findall(r"\S+", body))
    if word_count < 800:
        raise ValueError(f"Body has only {word_count} words (TRC needs 1000-1800, allowing 800 floor)")

    h2_count = len(re.findall(r"^## ", body, re.MULTILINE))
    # Fallback: if Gemini used ### for body sections (no ##), promote them
    if h2_count < 4:
        h3_count = len(re.findall(r"^### ", body, re.MULTILINE))
        if h3_count >= 4 and h2_count == 0:
            print(f"WARN: model used ### instead of ## ({h3_count} H3s); promoting to H2", file=sys.stderr)
            body = re.sub(r"^### ", "## ", body, flags=re.MULTILINE)
            text = text[:len(fm_match.group(0))] + "\n" + body + "\n"
            h2_count = h3_count
        else:
            raise ValueError(f"Only {h2_count} H2 headings (need 4+)")

    # AEO: at least half of H2s should be questions
    h2_lines = re.findall(r"^## (.+)$", body, re.MULTILINE)
    question_h2s = sum(1 for h in h2_lines if h.rstrip().endswith("?"))
    if question_h2s < h2_count / 2:
        print(f"WARN: only {question_h2s}/{h2_count} H2s are questions (AEO weak)", file=sys.stderr)

    # FAQ count
    faq_questions = len(re.findall(r"-\s+question:", fm))
    if faq_questions < 5:
        raise ValueError(f"FAQ has {faq_questions} questions (TRC needs 6+, allowing 5 floor)")

    slug = extract_field(fm, "slug")
    print(f"Validation OK: {word_count} words, {h2_count} H2s ({question_h2s} questions), {faq_questions} FAQs, slug={slug}")
    return slug, text


def log_to_sheet(slug: str, title: str, category: str, source: str, author: str, status: str) -> None:
    sa_json = os.environ.get("GCP_SA_KEY_JSON")
    if not sa_json:
        print("(sheet log skipped: GCP_SA_KEY_JSON not set)")
        return
    try:
        import gspread  # type: ignore
        from google.oauth2.service_account import Credentials  # type: ignore

        creds_info = json.loads(sa_json)
        creds = Credentials.from_service_account_info(
            creds_info,
            scopes=["https://www.googleapis.com/auth/spreadsheets"],
        )
        gc = gspread.authorize(creds)
        sh = gc.open_by_key(SHEET_ID)
        # Ensure tab + headers exist
        try:
            ws = sh.worksheet(SHEET_TAB)
        except gspread.WorksheetNotFound:
            ws = sh.add_worksheet(title=SHEET_TAB, rows=1000, cols=10)
            ws.update("A1", [["date", "platform", "content_type", "title", "url", "category", "post_id", "status", "author", "source"]])
        row = [
            datetime.now().strftime("%Y-%m-%d %H:%M"),
            "trc-blog",
            "blog",
            title,
            f"{SITE_BASE}/blog/{slug}/",
            category,
            slug,
            status,
            author,
            source,
        ]
        ws.append_row(row, value_input_option="USER_ENTERED")
        print(f"Logged to sheet: {slug}")
    except Exception as e:
        print(f"WARN: sheet log failed: {e}", file=sys.stderr)


def already_posted_today() -> bool:
    today = datetime.now().strftime("%Y-%m-%d")
    for f in BLOG_DIR.glob("*.md"):
        if f'date: "{today}"' in f.read_text():
            print(f"Already posted today ({today}): {f.name}. Exiting cleanly.")
            return True
    return False


def main() -> int:
    if already_posted_today():
        return 0

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set", file=sys.stderr)
        return 2

    used = existing_slugs()
    keyword, source, category = pick_keyword(used)
    author = random.choice(AUTHORS)
    image_path = pick_image()
    print(f"Topic: {keyword!r} | category={category} | source={source} | author={author} | image={image_path}")

    system_prompt = build_system_prompt()
    user_prompt = build_user_prompt(keyword, category, source, author, image_path)

    raw = call_gemini(system_prompt, user_prompt, api_key)
    slug, content = validate_and_extract(raw)

    date_str = datetime.now().strftime("%Y-%m-%d")
    final_slug = slug if slug not in used else f"{slug}-{date_str}"
    content = re.sub(r'slug:\s*"[^"]+"', f'slug: "{final_slug}"', content, count=1)
    content = re.sub(r'date:\s*"[^"]+"', f'date: "{date_str}"', content, count=1)

    out_path = BLOG_DIR / f"{final_slug}.md"
    out_path.write_text(content)
    print(f"WROTE: {out_path}")

    title = extract_field(re.match(r"^---\n([\s\S]*?)\n---", content).group(1), "title")
    log_to_sheet(final_slug, title, category, source, author, "published")
    return 0


if __name__ == "__main__":
    sys.exit(main())
