# UrbanXPixels × Remotion — Master Prompt Pack
Recreating the "AiSensy Demo / Overview" style video (9:16 SaaS explainer) for **UrbanXPixels** (urbanxpixels.com)

---

## 0. What I measured in your reference video

| Property | Value |
|---|---|
| Format | 720×1280 (9:16 portrait), **60 fps**, **142.2 s**, H.264 + AAC stereo 44.1 kHz |
| Look | Soft mint → aqua gradient background, white UI windows with dark-teal sidebar, iPhone mockups, two-tone green/ink kinetic headlines, stacked pastel notification cards |
| Structure | ~19 beats. Hero text → phone mockups → UI screens driven by a cursor → phone again, repeating. Nothing stays static for more than ~2 s |
| Cuts / transitions | ~39 visible motion bursts. Mostly blur-scale dissolves, whip-pan slides, phones rising from the bottom edge, and "camera" zooms into UI |
| Music | Continuous bed, **≈123 BPM**, no silence anywhere, very flat dynamics (loudness range 3.3 LU), integrated loudness **−15.5 LUFS**, tonal centre around G/G♯/F♯/A |
| SFX | ≈49 distinct high-frequency transient hits, about one every ~2.9 s. They sit on transitions, icon pops, cursor clicks and text reveals. They are sparse, not constant |
| On-screen text | All messaging is on screen (typed or word-by-word). I found no clear sign of continuous narration, but **I analysed the audio signal; I can't hear it, so confirm by ear** |

**What I found on urbanxpixels.com** (used throughout the prompt): creative digital agency in Ellenabad, Haryana. Tagline "Scale Your Brand 5X Faster". Services are high-speed web development, official WhatsApp Meta Cloud API automation (broadcast, AI bots, forms and payments via Razorpay/Stripe, multi-agent live chat, analytics, abandoned-cart recovery), graphic design, and video editing. Claims on the site that I reuse: 98% message open rate, 45–60% click & reply, <1.2 s load, 3x average revenue lift, 2.8x conversion lift, 50+ live deployments, 48 h delivery, zero setup fees, 100% source-code ownership.

> **Two honest caveats**
> 1. **"Same sound"**: the music track and SFX in AiSensy's video are their licensed/copyrighted assets, and I can't give you the actual audio. The prompt below specifies the *exact tempo, loudness, mood and cue timing* so you can license a near-identical track and match the SFX rhythm.
> 2. **UI and branding**: the prompt tells Claude to rebuild every screen as an original UrbanXPixels design with the same layout, pacing and motion. Don't copy AiSensy's logo, screenshots or wording.

---

## 1. How to use this pack

1. Create an empty folder, open it in **Claude Code** (or any Claude agent with a terminal), and make sure Remotion's agent skills are available (see Remotion docs → AI → Skills). Claude then follows Remotion's current API conventions.
2. Put these in the folder before you start: `reference/` (attach the images from `uxp_reference_frames.zip`, and optionally the original mp4), `public/brand/uxplogo.svg` and `favicon.svg` (download from the site), and your music file when you have it.
3. Paste everything between **BEGIN MASTER PROMPT** and **END MASTER PROMPT** below as your first message.
4. Then build **one scene at a time** using the iteration prompts in Appendix A. Do not ask for all 19 scenes in one shot; quality drops.
5. Preview with `npx remotion studio`, and render only when you're happy.

---

=== BEGIN MASTER PROMPT ===

# MASTER PROMPT — UrbanXPixels product-demo video (Remotion)

## A. Mission

You are a senior motion designer and Remotion engineer. Build a **~152-second, 1080×1920 (9:16) product-demo / explainer video** for **UrbanXPixels** (https://urbanxpixels.com).

**Brand context.** UrbanXPixels is a creative digital agency (Ellenabad, Haryana, India). Tagline: *"Scale Your Brand 5X Faster."* Offerings: (1) high-speed web development, (2) official WhatsApp Business API / Meta Cloud API automation: broadcast campaigns, AI bots, WhatsApp forms, payments via Razorpay and Stripe, multi-agent live chat, real-time analytics, abandoned-cart recovery, (3) graphic design systems, (4) video editing. Proof points you may use (and ONLY these): 98% WhatsApp message open rate, 45–60% click & reply rate, <1.2 s page load, 3x average revenue lift, 2.8x conversion lift, 50+ live deployments, 48 h delivery, zero setup fees, 100% source-code ownership.

**Style reference.** The attached reference frames come from a SaaS demo video. Match its **pacing, composition, motion language, UI density and sound rhythm**. Do **not** reuse its brand, logo, screenshots or copy. Every screen is rebuilt as an original UrbanXPixels design in React/DOM (no screenshots, no stock UI images).

**Creative principle.** Nothing sits still. Every 1–2 seconds something enters, moves, types, counts, or the "camera" pushes in. Every scene has ONE thing the viewer should notice first; build the frame around it.

## B. Project setup and engineering rules

- Scaffold: `npx create-video@latest --yes --blank --no-tailwind uxp-demo && cd uxp-demo && npm i`
- Install: `@remotion/transitions`, `@remotion/sfx`, `@remotion/media`, `@remotion/google-fonts`, `lucide-react` (optional: `@remotion/motion-blur`, `@remotion/shapes`, `@remotion/paths`).
- Follow the loaded **Remotion skills / best practices** for the exact current API (Interactive components, connected compositions, `TransitionSeries`, etc.).
- **All motion is driven by `useCurrentFrame()` + `interpolate()` / `spring()` / `Easing`.** No CSS `transition`, no CSS `animation`, no Tailwind animation classes. Keep `interpolate()` calls inline in `style`; prefer `scale`, `translate`, `rotate` CSS properties over `transform` strings.
- **One file per scene** (`src/scenes/S01_LogoReveal.tsx` …), each registered as its own `<Composition>` inside a `<Folder>` so I can preview a scene alone, plus a parent `UXP-Main` composition using `<TransitionSeries>`. Give every `TransitionSeries.Sequence` an inline `durationInFrames`.
- Author timing in **seconds**, convert with a helper: `const sec = (s:number) => Math.round(s * fps)`. Never hard-code raw frame numbers in scene logic.
- Assets in `public/`, referenced with `staticFile()`.
- Fonts via `@remotion/google-fonts` (see design tokens). Wait for font load before rendering.
- Build reusable primitives first (Section F), then scenes. Do **not** copy-paste UI between scenes.
- Don't render until I ask. Don't overwrite my manual edits; if code changed since you last saw it, assume it was intentional.

## C. Canvas, timing and beat grid

```ts
export const WIDTH = 1080, HEIGHT = 1920;
export const FPS = 60;            // match the reference. Use 30 while iterating, 60 for the final render
export const BPM = 123;           // measured from the reference music
export const BEAT = 60 / BPM;     // 0.4878 s
export const BAR  = BEAT * 4;     // 1.951 s
export const snapToBeat = (s: number, div = 2) => Math.round(s / (BEAT / div)) * (BEAT / div);
```

- Snap **scene starts, big whooshes and headline reveals to the nearest half-beat** so cuts feel musical. Cursor clicks and small SFX can be off-grid.
- Safe areas: keep key text ≥ 80 px from left/right and ≥ 140 px from the top. Captions live in the zone **y = 1380–1650**. Keep the bottom ~250 px free of critical content (social UI overlaps it).
- Minimum text sizes at 1080 px width: main headline 96 px, secondary 56 px, UI body text 28 px (UI is *meant* to read as "small real UI", but legible when the camera zooms in).

**Scene timeline (seconds, ≈152 s total)**

| # | Scene | Start | End | Length |
|---|---|---|---|---|
| S01 | Logo reveal + promise + dashboard rise | 0.0 | 4.5 | 4.5 |
| S02 | Phone swing-in + industry icon cards | 4.5 | 11.5 | 7.0 |
| S03 | Logo + service-tile burst | 11.5 | 16.5 | 5.0 |
| S04 | "48h" delivery timer | 16.5 | 19.5 | 3.0 |
| S05 | Dashboard: Contacts → Broadcast | 19.5 | 28.0 | 8.5 |
| S06 | Phone: rich media, carousel, payments | 28.0 | 36.0 | 8.0 |
| S07 | AI template generator UI | 36.0 | 50.0 | 14.0 |
| S08 | Campaign analytics | 50.0 | 62.0 | 12.0 |
| S09 | Multi-agent live-chat inbox | 62.0 | 70.0 | 8.0 |
| S10 | Phone: order-status chatbot | 70.0 | 79.0 | 9.0 |
| S11 | Kinetic question + notification stack | 79.0 | 84.0 | 5.0 |
| S12 | Flow builder | 84.0 | 89.0 | 5.0 |
| S13 | Phone: AI bot (voice + image) | 89.0 | 97.0 | 8.0 |
| S14 | Click-to-WhatsApp ad (Instagram/Facebook) | 97.0 | 103.0 | 6.0 |
| S15 | Ads manager + Creative Studio (design + video) | 103.0 | 122.0 | 19.0 |
| S16 | Integrations circle | 122.0 | 129.0 | 7.0 |
| S17 | Phone: "Turn chats into sales" (catalog → cart → pay) | 129.0 | 138.0 | 9.0 |
| S18 | Phone: WhatsApp Forms & Webviews | 138.0 | 143.0 | 5.0 |
| S19 | Stats montage + CTA outro | 143.0 | 152.0 | 9.0 |

(Transitions overlap neighbouring scenes; account for overlap in the parent composition's total duration. If I ask for a shorter cut, drop S08, S09 and S12 first.)

## D. Design system (define as `src/theme.ts` and use everywhere)

**Colour tokens** (sampled from the reference; then reconcile with the UrbanXPixels logo; see the note below):
```ts
export const C = {
  bgA: '#E4FBEF', bgB: '#C9F6E8', bgC: '#C1EEE9',     // mint → aqua gradient stops
  blobMint: '#BFF5DC', blobAqua: '#B8F0F2', blobLime: '#E6FCD9',
  accent: '#3FA858',      // headline highlight green
  accentDeep: '#204E49',  // app sidebar, primary buttons, table headers
  wa: '#25D366',          // WhatsApp green (CTAs)
  bubbleOut: '#D9FDD3', bubbleIn: '#FFFFFF', chatWallpaper: '#EFEAE2',
  ink: '#1B2B26', inkSoft: '#5B6B66', white: '#FFFFFF',
  line: '#E6ECEA', warn: '#F5A524', info: '#3B82F6', danger: '#EF6A5B',
  shadow: '0 30px 80px rgba(20,80,60,0.18)',
};
```
> **Brand reconciliation:** fetch `https://www.urbanxpixels.com/uxplogo.svg` and `favicon.svg`, read their fill colours, and tell me if the real UXP primary differs from `accent`. If it does, propose a swap for `accent`/`accentDeep` and keep the mint gradient family unless it clashes. Ask me before changing.

**Background (shared `<GradientBG/>`):** linear 160° gradient `bgA → bgB → bgC`, plus 3 large blurred radial blobs (500–800 px, blur 120 px, opacity .6) drifting slowly with `Math.sin(frame / (fps*6) + phase)` so the backdrop is subtly alive. Same component behind every scene so cuts don't "flash".

**Typography**
- Headlines: **Plus Jakarta Sans 800** (fallback Poppins 700), letter-spacing −0.03em, line-height 1.05. Two-tone: ink + `accent` on the key words.
- UI / chat / notifications: **Poppins** 400/500/600 (Inter is an acceptable fallback). Notification titles may use Poppins 600 italic in alt variants.
- Numerals (timer, counters): tabular-nums, Poppins 600.

**Shape language:** phone radius 78, cards 24, buttons 12, chips 999. White UI windows have a 24 px radius and the large soft shadow. Floating "industry" icon cards are 132×132 white squares with a **3 px dark-ink outline and a hard offset shadow (6px 6px 0 ink)**. Service tiles (S03) are solid near-black rounded squares with white line icons.

**App window shell (`<AppWindow/>`):** white card, optional 92 px dark-teal sidebar with 12 line icons (Dashboard, Live Chat, History, Contacts, Campaigns, Ads, Flows, Pay, Manage, Integrations, Commerce) and an avatar "A" at the bottom. Active item = pale-teal pill. Top bar with page title (Poppins 600, 32 px).

**Phone (`<Phone/>`):** black 14 px bezel, 78 px radius, dynamic-island variant and notch variant, iOS status bar "9:41", battery. Inside is a real DOM WhatsApp chat: header (back chevron, avatar, business name + blue verified tick), wallpaper `chatWallpaper`, incoming bubbles white, outgoing `bubbleOut`, tiny timestamps with ✓✓, quick-reply buttons as full-width white rows with green text, bottom input bar with sticker/camera/mic. On stage it is ~560 px wide, centred, with `shadow`.

## E. Motion language (define in `src/motion.ts`)

```ts
export const EASE_OUT    = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_INOUT  = Easing.bezier(0.65, 0, 0.35, 1);
export const SPRING_SOFT = { damping: 200 };                       // UI slides, no bounce
export const SPRING_POP  = { damping: 12, stiffness: 180, mass: 0.6 }; // icons, badges: 8–12% overshoot
export const SPRING_SNAP = { damping: 20, stiffness: 220 };          // buttons, chips
```
- **Enter:** `translateY 40px → 0` + `opacity 0 → 1` + `blur 14px → 0` over 0.5–0.8 s, `EASE_OUT`.
- **Exit:** `scale 1 → 1.08` + `blur 0 → 18px` + `opacity → 0` over 0.35–0.5 s.
- **Stagger:** words 3–4 frames @30fps; icon pops 4 frames; list rows 2–3 frames; notification cards 0.7 s.
- **Idle:** floating icons bob ±8 px (period 2.4–3.2 s, phase-offset per item); phones sway ±0.6°; background blobs drift.
- **Virtual camera (`<Camera/>`):** wrapper around UI scenes that animates `scale 1 → 1.3–2.4` and `translate` toward the active region over 1–1.5 s with `EASE_INOUT`. The UI is often **oversized and cropped by the frame edges** like the reference, so don't "fit" windows neatly inside the canvas.
- **Text reveals:** (a) char-by-char typing for question/prompt text, (b) word-by-word slide-up with mask and unblur for captions, (c) word-swap crossfade (old words blur out as new words blur in).
- **Counters:** `interpolate` the number with `EASE_OUT`; format with `toLocaleString('en-IN')`.
- Use cheap CSS `filter: blur()` driven by `interpolate` for blur choreography. Only reach for `@remotion/motion-blur` on a few whip-pans if render time allows.

## F. Reusable component library (build these first, each previewable in isolation)

| Component | Purpose / key props |
|---|---|
| `GradientBG` | Shared animated mint backdrop |
| `Logo` | UXP logo with `mode: 'icon' \| 'full'`, wordmark wipes out from behind the icon |
| `Phone` | `{variant: 'island'\|'notch', children, rotate, scale}`, bezel, status bar, optional `popOutCards` slot (cards that overlap and escape the bezel) |
| `WAChat` | Declarative script: `[{t, from:'in'\|'out', type:'text'\|'buttons'\|'image'\|'voice'\|'carousel'\|'cart'\|'payment', ...}]`. Handles typing dots (0.6 s), slide-up, and auto-scroll as messages append |
| `AppWindow` | White card + optional sidebar, `activeNav`, slide-in direction |
| `Cursor` | Skins `'hand'` and `'arrow'`; takes waypoints `[{t,x,y,click?}]` (see Section I) |
| `KineticText` | Modes `'type' \| 'words' \| 'swap'`, `highlight` word list for accent colour |
| `FloatingIconCard` | Outlined icon card + label + connector line that draws in |
| `NotificationCard` | Colour variants (cyan, orange, blue, grey, yellow), bell tile, title, message, × |
| `StatChip` | Count-up number + label |
| `AreaChart` | SVG path that draws left→right, fill fades in, dashed gridlines |
| `DataTable` | Rows stagger in, checkbox ticks, colour tag chips (HOT/WARM/COLD) |
| `FlowNode` + `Connector` | Node cards with ports; bezier connectors animated with `stroke-dashoffset` |
| `Camera` | Scale/pan wrapper (Section E) |
| `Sfx` | Thin wrapper that places a sound at a scene-relative time (Section J) |

## G. Scene-by-scene storyboard

Each scene lists: **Visual → Motion → Cursor → SFX → Copy**. Times are scene-relative unless stated. All client names, prices and chat content are mock data. Use "Aura Beauty" as the demo D2C brand.

### S01 · Logo reveal + promise + dashboard rise (0.0–4.5 s)
- **Visual:** empty gradient. UXP **icon** appears at centre (y≈45%). The wordmark wipes out from behind it left→right. Then the logo shrinks to ~55% and glides up to y≈24%. Headline appears below: **"Scale Your Brand"** in ink, **"5X Faster"** in accent. Sub-line: *Web · WhatsApp Automation · Design · Video* (fades in, 40 px).
- **Motion:** icon pops with `SPRING_POP`; headline words slide up with mask + unblur, 5-frame stagger. At ~2.0 s a **UXP "Command Center" dashboard window** rises from below the frame, starting tilted ~4° and settling flat, parked lower-left and bleeding off the bottom edge (KPI cards, WhatsApp-connect QR card, pastel yellow/green/blue/purple feature cards). At ~4.2 s everything exits with blur-scale.
- **Cursor:** hand cursor enters from lower-right, taps the icon at ~0.2 s (press dip), exits.
- **SFX:** soft pop @0.1, whoosh @0.8 (wordmark), rising whoosh @2.0 (dashboard), whip @4.2 (exit).

### S02 · Phone swing-in + industry icon cards (4.5–11.5 s)
- **Visual:** iPhone (notch variant) swings in from lower-right, rotated ~25°→0° with overshoot, landing centre. Chat with **Aura Beauty ✓**: an order card (product thumbnail, "Charcoal Face Wash × 1", Total ₹1,500, "Hi, kindly complete payment to confirm your order", buttons **Review and Pay** / **Pay Now**), then an outgoing green bubble **₹1,500.00 · Paid ✓ · Sent to Aura Beauty**.
- **Around the phone:** 6 `FloatingIconCard`s pop one by one (0.35 s stagger) at top-left, top-right, mid-left, mid-right, bottom-left, bottom-right, each with a thin connector line drawing in and a label: **E-Commerce, Fintech, Real Estate, Education, Healthcare, Logistics**. They bob until the exit. Two or three tiny extra icon tiles flicker in the gaps for density.
- **Exit (~11.0 s):** all cards fly outward with blur while the phone slides off to the right.
- **SFX:** whoosh/whip @0 (swing-in), pop per icon card (6×, matching stagger, pitch varied slightly), whoosh @6.8 (exit).

### S03 · Logo + service-tile burst (11.5–16.5 s)
- **Visual:** large full logo centred (y≈48%). Tagline beneath: *"Everything your brand needs to grow."* From the bottom, **10 black rounded-square tiles** with white line icons pop around/below the logo. Four are larger and are the real services: Web (globe), WhatsApp (message-circle), Design (palette), Video (clapperboard). Six are small: bot, credit-card, bar-chart, users, megaphone, zap.
- **Motion:** tiles rise from y+300 with `SPRING_POP`, 4-frame stagger, then bob gently. At the end, they sink/fade as the timer appears.
- **SFX:** pop per tile (sparse; max 5 audible pops, rest silent), whoosh @4.3.

### S04 · "48h" delivery timer (16.5–19.5 s)
- **Visual:** centred outlined box (2 px accent border, 8 px radius, tinted fill) containing a big timer, label above: *"Go live in"*. Timer starts at **48:00** then rapidly counts down with slot-machine digit rolls to **00:00**, flashes accent, and the text changes to **"Live ✓"**.
- **Cursor:** hand enters bottom-left, clicks the box at ~1.2 s.
- **Transition out:** the box **expands into the app window** for S05 (shared-element scale-up: the white window grows out of the box's rect).
- **SFX:** tick-tick during countdown (sparse), click @1.2, whoosh on expand.

### S05 · Dashboard: Contacts → Broadcast (19.5–28.0 s)
- **Visual:** `AppWindow` with dark-teal sidebar slides in from the left. Sidebar icons stagger-fade. Cursor moves to **Contacts** → page title "Contacts", a green pill banner: *"New: AI bots & abandoned-cart recovery are live."*, a "Quick Guide" card ("Import up to 2 lakh contacts in one go"), and a table (Name · Mobile Number · Date of Birth · Tags · Source). Rows fill in with 80 ms stagger. Cursor ticks checkboxes row by row while a counter rolls **0 → 22,933 → 71,463 → 89,872**.
- **Camera:** at ~5.5 s the camera **zooms into the table (scale ≈1.6)** and pans left→right, so DOB/Tags/Source columns (HOT/WARM/COLD/MAGNITE chips, "IMPORT" source) are revealed, with toolbar buttons **Broadcast · + Add Contact · Import ▾** at the top edge. The window slides up and out as a phone rises (S06).
- **Cursor:** arrow skin. Click Contacts @2.0, ticks @3.2–4.2, click **Broadcast** @8.0.
- **SFX:** whoosh (window in), click ×3 (sidebar/contacts), soft "tick" per checkbox (3–4 max), whip on camera pan, click on Broadcast.

### S06 · Phone: rich media, carousel, payments (28.0–36.0 s)
- **Visual:** phone (dynamic-island variant) rises from the bottom with `SPRING_SOFT`. **Caption below** (y≈1500, accent+ink, 76 px): *"Engaging Carousel Cards"* → word-swap → *"Captivating Media-Rich Messages"*. Phase 1: a promo text message, then a **horizontal carousel** of 3 product cards (image, title, price, "Shop Now") swiping left. Phase 2 (~3.0 s): chat changes to an abandoned-cart message from **Aura Beauty ✓**: product hero image with "10% OFF" badge, *"Hey Ananya, your cart with Charcoal Face Wash & Vitamin C Serum is still waiting for you 😊 Save an extra 10% if you complete checkout by midnight tonight."*, buttons **Go to Cart / View Products**. Phase 3 (~5.5 s): caption → *"WhatsApp Payments"*; the order card and the green **₹1,500.00 Completed** bubble **pop out of the phone** and overlap the bezel (left card and right card), as in the reference.
- **Motion:** card swipes use `EASE_INOUT`; pop-out cards use `SPRING_POP` with 3° rotation and a bigger shadow.
- **SFX:** whoosh (phone rise), swipe "page-turn" per carousel move, ding on the message arrival, pop on pop-out cards, ding on payment complete.

### S07 · AI template generator UI (36.0–50.0 s)
- **Visual:** UI (window mostly cropped by the frame). Templates page: green banner *"Generate powerful WhatsApp templates in seconds"* with **Generate Now** button, grid of template cards (Independence Sale, Wishes + Offer, Rakhi Offer…) with preview/submit buttons. Cursor clicks **Generate Now** → a **"New Template Message" modal slides up**. Inside: *Generate with AI* box; prompt types char-by-char: **"Create an exclusive offer for gifting items for this festive season"**; style chips (Normal / Poetic / **Exciting** / Funny), optimise chips (Click Rate / Reply Rate); **Generate (₹10)** button presses → skeleton shimmer 0.6 s → **3 generated variants** fade in side by side (emoji copy + CTA buttons "Shop Gifts", "Grab Offer", "Use This"). Cursor clicks **Use This**.
- **Camera:** push-in on the prompt (scale 1.5) while typing, pull-back when variants appear.
- **SFX:** whoosh (modal up), typing ticks (soft, low volume, only while typing), click on Generate, shimmer swoosh, ding when variants land, click on Use This.

### S08 · Campaign analytics (50.0–62.0 s)
- **Visual:** sidebar + **Campaigns** page. Orange banner *"Launch your next broadcast in 48 hours."* A metrics row of coloured percentages (**80% Read, 25% Clicked, 20% Replied, 10% Failed**), campaign details (Message type, Template name, Sent at, Duration "Completed in 1 minute"), an **area chart "Audience (per day)"** that draws left→right with the fill fading in and dashed gridlines, then a table (Read At / Replied At rows).
- **Overlay:** after the chart finishes drawing, 2 `StatChip`s pop over it: **98% open rate**, **45–60% click & reply**.
- **Camera:** slow horizontal pan across the UI, always cropped.
- **SFX:** whoosh (page in), soft rising sweep during chart draw, pop for each chip.

### S09 · Multi-agent live-chat inbox (62.0–70.0 s)
- **Visual:** window with tabs **ACTIVE (5) · REQUESTING (4) · INTERVENED**, a search field, and a contact list with avatars (initials or illustrated avatars): Rahul Sharma, Ananya Verma, Mohit Kapoor, Sneha Iyer, Rohan Malhotra, each with a last message and an unread badge ("1+", "5+", "2+", "3+"). Badges pop with `SPRING_POP`, rows stagger in. The selected row highlights. Right-hand pane is a pale-yellow chat panel (empty).
- **Cursor:** hovers rows, then clicks **Broadcast / Action**.
- **SFX:** ding per new badge (stagger), click.

### S10 · Phone: order-status chatbot (70.0–79.0 s)
- **Visual:** phone centred, business **Aura Beauty ✓**. Script: user *"Hi, I'd like to check my order status."* → bot *"Sure! Please select what you'd like to do:"* [Track Now / Order Details] → user *"Track Now"* → bot *"Your order #ORD1234 has been shipped today. Expected delivery: 2–3 business days. Would you like real-time updates on WhatsApp?"* [Yes / No] → user *"Yes"* → bot *"Done! You'll now get real-time tracking updates directly on WhatsApp."*
- **Motion:** typing dots 0.6 s before each bot bubble, bubbles slide up, chat auto-scrolls upward. At ~8.5 s the phone tilts and slides out with blur.
- **SFX:** WhatsApp-like "pop" per message (use soft pop, not WhatsApp's own sound), ding on final message, whip on exit.

### S11 · Kinetic question + notification stack (79.0–84.0 s)
- **Visual:** top-left aligned text, 72 px, typed char-by-char: **"Support inbox overflowing with common questions?"**, with *"overflowing"* in accent. Meanwhile **5 colour-coded `NotificationCard`s** rise from the bottom edge, one every 0.7 s, each landing in front of the previous so they form a **stacked deck** (older cards stay behind at 0.95 scale, offset 20 px, slightly dimmed). Colours in order: cyan, orange, blue, grey, yellow. Messages: *"Hi, I haven't received my order update yet. Can you check?"* · *"Need invoice copy for my last purchase."* · *"Payment successful, but not reflecting in my account."* · *"My account is blocked! Please resolve ASAP."* · *"How do I return an item ordered yesterday?"* Each card bounces with a slight squash (scaleY .92 → 1).
- **SFX:** one notification ding per card (pitch rising slightly), soft typing ticks, whip on exit.

### S12 · Flow builder (84.0–89.0 s)
- **Visual:** canvas window. Left panel: **Message types** grid (Text, Media, List, Buttons, Template, Product, WhatsApp Pay) and **Actions** (Request Intervention, Location, Webhook…). A **Flow Start** node (keywords Hi / Hello / Help). Cursor **drags** a "Media Buttons" tile onto the canvas (ghost follows at 3° tilt with a bigger shadow), it snaps in with `SPRING_SNAP`, then a bezier connector draws to it. Add a second node (map image + buttons **Track Order / Talk to an Agent**) and a **Request Intervention** node ("Our team will be in touch with you soon!"). Top-right **Save Changes**.
- **Camera:** pans right to follow new nodes.
- **SFX:** pick-up click, drop "thunk", connector "zip" (short), click on Save.

### S13 · Phone: AI bot with voice + image (89.0–97.0 s)
- **Visual:** big label **"AI"** top-left in accent (types in). Phone with chat: customer **voice note** bubble (animated waveform, play icon), bot **voice reply + text answer**, then an **image bubble** (product photo) and *"Add to cart"* button. At ~5 s the phone scales 1.0 → 1.3 and **bleeds off the frame** (zoom-in crop). Content for UXP: "AI Sales Assistant" answering a skincare question and recommending a product.
- **SFX:** voice-note "blip", message pops, whoosh on zoom.

### S14 · Click-to-WhatsApp ad on Instagram (97.0–103.0 s)
- **Visual:** phone showing an Instagram feed with a **Sponsored** post: UXP-designed creative *"Glow That Shows"* (product on warm background), a full-width green CTA bar **"Chat on WhatsApp"**. **Instagram logo floats above** the phone and **Facebook logo below** (pop + bob). Hand cursor taps the CTA, ripple ring, the screen cross-dissolves into S15.
- **SFX:** pop (logos), click, whoosh.

### S15 · Ads manager + Creative Studio (103.0–122.0 s)
- **15a (103–110) Ads manager:** window with a teal hero banner and a 3-step stepper (Connect Facebook → Link WhatsApp number → Go live), KPI cards (Avg daily spend, **Cost per lead ₹16.16**, Total spend, Conversions), campaign table with status chips (Active green, Paused orange). Cursor clicks **Sync** and **Download report**.
- **15b (110–117) Creative Studio, graphic design:** left menu *Click to WhatsApp Ads → Ads manager / Setup / Audiences*, form with **Generate with AI**; prompt types **"Please generate an ad for my new product launch."**; resolution chips (4:5 / 9:16 / 1:1), product-image upload tile with a serum bottle photo, **Generate** button (deep teal). The ad preview card pops in on the right (*Aura Beauty · Sponsored*, **"Glow That Shows"** creative, WhatsApp CTA, "Est. reach 1.2M"). Cursor clicks **Use this**, then **Next →**.
- **15c (117–122) Video editing:** quick cut to a **timeline UI** (3 tracks, coloured clips, playhead scrubbing, waveform strip) to show the video-editing service, with a short label *"Scroll-stopping video cuts"*. Clips snap into place on the beat.
- **Camera:** continuous push-in/out; UI cropped by the edges.
- **SFX:** whoosh on each sub-scene change, click ×4, typing ticks, ding when preview appears, 3 quick "clip-snap" ticks in 15c.

### S16 · Integrations circle (122.0–129.0 s)
- **Visual:** full logo top, subline in accent **"Seamless integrations made simple"**. A thin vertical line draws down into a **large outlined circle (3 px accent)**. Official brand logos pop in inside it, two staggered rows: **Shopify, WooCommerce, Razorpay, Stripe, Meta, Next.js** (use official brand SVGs I supply; if missing, tell me which are needed; don't invent logos).
- **Motion:** line draws 0.5 s, circle stroke draws 0.8 s, logos `SPRING_POP` with 4-frame stagger, then subtle bobbing.
- **SFX:** line "zip", pop per logo (6), whoosh out.

### S17 · Phone: "Turn chats into sales" (129.0–138.0 s)
- **Visual:** persistent caption below the phone for the whole scene (two lines, 76 px): **"Turn chats"** / **"into sales"** (gradient accent→ink, line-by-line slide-up). Phone rises from below.
- **Flow:** user **"Shop"** → bot *"Please select an option to continue-"* [**View All Products** / **Hot Deals!**] → hand cursor taps **View All Products** → a native **catalog sheet slides up**: *Summer Collection* banner with dark overlay, product rows (thumbnail, name, price, **+** stepper). Cursor taps **+** on two rows (badge flips to a black square "1"), then **View Cart** (full-width green) → **Your Cart** (2 items, black qty chips, **Continue** button) → tap **Continue** → sheet dismisses, chat shows a cart bubble *"🛒 2 items · ₹2,298 · View Sent Cart"*, bot *"Your estimated total is ₹2,298. Tap on the button below to make the payment."* [**Pay Now**], then a green **₹2,298 · Sent to Aura Beauty · UPI** payment bubble.
- **Camera:** gentle zoom into the payment bubble at the end, then blur-through to S18.
- **SFX:** whoosh (phone up), click per tap (5), sheet-up whoosh, ding on payment.

### S18 · Phone: WhatsApp Forms & Webviews (138.0–143.0 s)
- **Visual:** phone with bot message *"Hi Rohit 👋 thanks for showing interest in our Glow Sale. Please fill this quick form to personalise your offer."* [**Fill Form**]. Cursor taps → **form sheet** slides up (title *"Glow Sale Offer"*, fields Full Name / Skin Type / City / Budget, **Continue** green button). Caption below: *"WhatsApp Forms"* then **"& Webviews"** (the "&" drops onto line two, word-by-word).
- **SFX:** click, sheet whoosh, ding.

### S19 · Stats montage + CTA outro (143.0–152.0 s)
- **Visual:** background gradient intensifies slightly. 2×2 grid of `StatChip`s count up with `SPRING_POP`: **98% message open rate · 45–60% click & reply · <1.2 s page load · 3x avg. revenue lift**. Then a wipe to the **logo lock-up (big)**, headline **"Scale Your Brand 5X Faster"**, sub-line *Web · WhatsApp Automation · Design · Video*, a deep-teal pill button **"Get a Free Quote"** (hand cursor clicks it with a pulse ring), then **urbanxpixels.com** and a WhatsApp chip **+91 95887 12743** (taken from the site's wa.me link; confirm with me before publishing).
- **Ending:** hold the final frame for 2 s, music tail fades out over the last bar (~1.9 s).
- **SFX:** pop ×4 (stats), whoosh (wipe), click on CTA, final soft "ding" on the logo lock-up.

## H. Transition catalogue (map to `@remotion/transitions` + custom presentations)

| Name | Where used | How |
|---|---|---|
| **Blur-scale dissolve** | S01→S02, S10→S11, between hero scenes | Custom presentation: outgoing `scale 1→1.08`, `blur 0→18px`, `opacity→0`; incoming `scale .96→1`, `blur 14→0`. 12–15 frames @30 |
| **Whip-pan slide** | UI → UI (S07→S08, S08→S09) | `slide({direction:'from-right'})` + a short horizontal blur; overshoot 6% via `springTiming` |
| **Phone rise / drop** | Any phone scene | Element-level spring from below the frame; the previous scene's content blurs behind |
| **Shared-element expand** | S04→S05 | Timer box rect scales up into the window rect, content cross-fades inside |
| **Camera zoom-through** | S05 (table), S13, S17→S18 | Scale 1→2.4 into a target, cross-fade at peak blur, new scene starts zoomed-out |
| **Stack cover** | S11 | Notification cards act as the wipe into S12 |
| **Swing-in** | S02 | Rotation 25°→0° with `SPRING_POP`, anchored lower-right |
| **Word-swap** | Captions in S06, S17, S18 | Old words blur/slide up out, new words blur/slide in |

Use `springTiming({ config:{damping:200}, durationInFrames:14 })` as the default transition timing; `linearTiming` for fades.

## I. Cursor choreography

- **Skins:** pointing-hand (white fill, 2.5 px black outline) in brand/hero scenes (S01, S04, S14, S17, S18, S19); standard arrow (white fill, black outline, soft shadow) in UI scenes (S05, S07, S08, S09, S12, S15).
- **Motion:** each hop 0.5–0.9 s along a cubic bezier with a slight overshoot and settle; add ±1.5 px idle jitter. Never move in straight lines.
- **Click:** cursor scale 1 → 0.82 → 1 over 6 frames; the target element presses (`scale .97`, colour −8% lightness) for 8 frames; on hero scenes add an expanding ring (0 → 60 px, fade). Fire the click SFX on the press frame.
- **API:** `<Cursor skin="arrow" path={[{t:0.4,x:700,y:1400},{t:1.2,x:320,y:480,click:true}]} />`. All coordinates in 1080×1920 stage space; derive them from real element positions where possible (measure DOM) so clicks land on their targets.

## J. Sound design

**1. Music bed (one continuous track, no gaps)**
- Style: upbeat modern corporate-pop / electro-pop, 4/4, **≈123 BPM**, bright plucked synth + light kick/clap, optimistic and clean, **no vocals**, almost no dynamic build-ups or drops (the reference's loudness range is only 3.3 LU, so it stays at one steady energy level).
- Tonal centre around **G / G♯ / F♯ / A**. Any key works, but keep it major-leaning and bright.
- Length ≥ 152 s, or a loopable track with a clean ending. Fade-in 0.4 s at start; final-bar fade-out ~1.9 s.
- Licensing: use a **royalty-free / licensed** track (Artlist, Epidemic Sound, Uppbeat, Pixabay Music, YouTube Audio Library). Search terms: *"upbeat corporate pop 123 bpm"*, *"tech explainer bright pluck"*, *"SaaS product demo upbeat"*.
- Mix: music sits at roughly **−18 to −16 dBFS RMS** so the finished video lands at about **−15.5 LUFS integrated** (same as the reference); peaks ≤ −1 dBTP.
- Use `@remotion/media` `<Audio src={staticFile('audio/music.mp3')} volume={(f) => ...} />` with a volume callback for the fade-in/out and for ducking.

**2. SFX style and density**
- Bright, airy, short (< 400 ms) and mostly high-frequency (the reference has a bright spectral balance), all clean UI sounds: soft pops, glassy clicks, light whooshes, a gentle "ding" for success. No cartoon/meme sounds.
- **Density target ≈ one cue every ~2.9 s on average**, clustered 3–4 in a row during cursor-click sequences and totally absent during calm holds. Music alone should be audible in at least a few moments per scene.
- Vary each repeat slightly (±6–8% `playbackRate`, ±1.5 dB volume) so repeated pops don't machine-gun.
- Place SFX **a few frames BEFORE the visual hit** (2–3 frames @30 fps) so the sound feels attached to it.
- On big whooshes, duck the music by −2 to −3 dB for ~300 ms.

**3. SFX palette and mapping**

| Event | Sound | Source |
|---|---|---|
| Scene transitions / phone rise / window slide | Soft whoosh | `https://remotion.media/whoosh.wav` |
| Fast whip-pans, scene exits | Quick whip | `https://remotion.media/whip.wav` |
| Cursor clicks, button presses | Glassy click | `https://remotion.media/mouse-click.wav` |
| Tab/toggle/select changes | Switch | `https://remotion.media/switch.wav` |
| Success, payment, message arrival, notification cards | Gentle ding | `https://remotion.media/ding.wav` |
| Carousel swipes, page changes | Page turn | `https://remotion.media/page-turn.wav` |
| Icon / badge / logo pops, typing ticks, connector "zip", drop "thunk", chart sweep, slot-machine tick, shimmer | **Not built in.** Find CC0 UI sounds (e.g. the `soundcn` repo, Freesound CC0, Pixabay SFX) and save to `public/sfx/` | download, trim to < 400 ms |

Use only the whoosh/whip/click/switch/ding/page-turn entries from the built-in list; ignore the meme sounds in that library.

**4. Implementation pattern**
```tsx
// Scene-relative SFX: moves with the scene automatically
<Sfx at={0.8} src="whoosh" volume={0.7} />
// Sfx = <Sequence from={sec(at) - 2} durationInFrames={sec(0.6)}><Audio src={...} volume={volume} playbackRate={1 + jitter}/></Sequence>
```
- Keep a single `cues.ts` per scene listing `{at, sound, volume}`, so I can retime without touching the visuals.
- Cues that fall inside a transition overlap belong to the **outgoing** scene's tail or to the parent composition at an absolute time.
- Final pass: a `MixCheck` composition (or ffmpeg `ebur128`) to confirm −15.5 LUFS ±1 and true peak ≤ −1 dBTP.

## K. Folder structure and build order

```
src/
  Root.tsx              # registers UXP-Main + all scenes inside <Folder>s
  UXPMain.tsx           # TransitionSeries + parent-level audio
  theme.ts  motion.ts  timing.ts
  components/           # Section F
  scenes/S01_...S19_*.tsx
  cues/S01.ts ... S19.ts  # SFX cue lists
  data/                 # mock chat scripts, table rows, copy
public/ brand/ audio/ sfx/ img/ logos/
```
**Build order (stop after each step and let me preview):**
1. `theme.ts`, `motion.ts`, `timing.ts`, `GradientBG`, `Logo`, `KineticText`, `Cursor`.
2. `Phone` + `WAChat` (with a test script) and `AppWindow` + `Camera`.
3. S01 → S04 (hero section) with SFX placeholders.
4. S05 → S09 (UI section).
5. S10 → S14 (phone/chat section).
6. S15 → S19.
7. Parent composition with transitions, then music + SFX pass, then polish.

Before writing code, **reply with**: (a) the files you will create, (b) any blocking questions (max 3), (c) your plan for the first build step. Then proceed with step 1 only.

## L. Quality bar and render

**Checklist**
- Nothing static > 2 s; every scene has an obvious focal point.
- No CSS transitions/animations anywhere; no text clipped or overlapping; captions stay in the caption zone.
- UI feels "real": consistent radii, shadows, icon stroke weights (1.75 px), fonts.
- Cursor clicks land exactly on their targets and coincide with the press state and click SFX.
- Every scene start and big whoosh lands on a half-beat.
- Text is readable at phone size at 100% (judge at 1080×1920 and at ~390 px wide).
- No third-party branding other than the integration logos I supply.

**Render (only when I say so)**
```
npx remotion render UXP-Main out/uxp-demo.mp4 --codec=h264 --crf=16
```
Use `--concurrency` to speed up if memory allows. If render time is heavy, reduce motion-blur usage first, not resolution.

=== END MASTER PROMPT ===

---

## Appendix A — Iteration prompts (use these after the master prompt)

**A1. Build one scene**
> Build **S05** exactly as in the storyboard. Use only components from `src/components`; add new ones if needed. Keep SFX cues in `cues/S05.ts`. Then show me a short list of every animation with its start/end time so I can check against the storyboard. Don't touch other scenes.

**A2. Match a reference frame**
> I've attached reference frame `[name]` at `t=[x]s`. Compare your current S[nn] at that moment against it and adjust layout, scale, crop, spacing and typography to match the *composition*, not the branding. List what you changed.

**A3. Beat-sync pass**
> Using BPM 123, list each scene's start time and its distance to the nearest half-beat. Snap every scene start and major transition to the nearest half-beat. Adjust durations without changing the total by more than 0.3 s.

**A4. SFX placement pass**
> Go through S[nn] and place SFX cues using the palette in Section J. Add them in `cues/S[nn].ts` with scene-relative times, 2–3 frames ahead of the visual hit. Keep the density to roughly one cue per 3 s except during click sequences. Randomise rate/volume slightly on repeats.

**A5. Motion polish**
> Review all scenes for consistent easing. Replace any linear motion with `EASE_OUT`/`EASE_INOUT`/springs from `motion.ts`. Add idle bobbing to floating elements, add blur to entries/exits, and make sure UI scenes use the `Camera` with at least one push-in. Report anything still static > 2 s.

**A6. 60-second cut (for Reels/ads)**
> Create `UXP-Short` (~60 s) reusing the same scene components: S01, S02, S05 (shortened), S06, S10, S11, S17, S19. Retime transitions, keep the same music at a different edit point, and ensure the ending lands on the last bar.

**A7. 16:9 variant**
> Create `UXP-Wide` (1920×1080). Reuse scenes through layout props: phones move left with captions on the right, UI windows go full width. Don't duplicate scene logic.

**A8. Performance**
> The render is too slow. Profile which scenes are heaviest (blur, large shadows, big DOM), and reduce cost without visible change: pre-rasterise static shadows, limit blur radius, avoid animating `box-shadow`, memoise static subtrees.

---

## Appendix B — Reference timing data (from the original video; inferred, not listened to)

These come from automated analysis: visual motion bursts via frame differencing, and SFX-like transients via high-band onset detection. Use them as a **rhythm guide** for your cues, not as exact truth.

**Visual transition / motion bursts (seconds):**
```
24.4, 30.3, 33.1, 33.8, 36.0, 39.8, 46.9, 52.0, 55.2, 58.6, 70.3, 75.8, 79.0, 80.6, 81.1, 81.5,
82.0, 83.2, 84.4, 87.0, 89.1, 91.4, 97.3, 99.5, 103.3, 104.3, 106.3, 107.9, 109.8, 113.0,
116.5, 117.2, 117.7, 118.5, 119.7, 122.8, 133.7, 137.0, 139.5
```

**SFX-like transient hits (seconds):**
```
0.8, 2.4, 6.1, 7.8, 10.1, 11.8, 14.6, 18.2, 19.0, 22.0, 22.3, 22.6, 23.6, 26.4, 29.8, 32.7, 33.7,
37.1, 37.3, 39.1, 39.4, 42.5, 42.8, 46.3, 48.1, 48.4, 49.5, 55.9, 58.7, 60.4, 63.3, 65.0, 65.4,
66.2, 69.1, 74.1, 89.2, 89.7, 103.4, 112.0, 121.6, 130.0, 132.4, 132.7, 134.0, 135.3, 135.8,
136.6, 138.8
```
Observations: hits are sparse in 70–89 s and 90–130 s (mostly music + a few cues), dense in 19–50 s (click sequences) and in 130–139 s (cursor taps on the phone).

**Reference-video text that appears on screen** (rewrite for UXP; don't reuse): "Smartest WhatsApp Engagement Platform", "Captivating Media Rich Message", "WhatsApp Payment", "Customer support inbox overflowing with common questions?", "AI", "Seamless integrations made simple", "Turn chats into sales", "WhatsApp Form & Webviews".

---

## Appendix C — Asset checklist

| Asset | Where from |
|---|---|
| UXP logo (icon + full) | `https://www.urbanxpixels.com/uxplogo.svg`, `favicon.svg` |
| Music (≈123 BPM, upbeat, no vocals) | Licensed library (see Section J) |
| SFX (pop, tick, zip, thunk, sweep) | CC0 packs, saved to `public/sfx/` |
| Integration logos (Shopify, WooCommerce, Razorpay, Stripe, Meta, Next.js) | Official brand SVGs (check each brand's guidelines) |
| Instagram / Facebook icons | Official brand assets |
| Product photos (serum bottle, face wash, tees, headphones) | Your own shoots, licensed stock, or AI-generated (mark as mock) |
| Avatars for inbox/testimonials | Illustrated or initials; avoid real people unless you have permission |
| Fonts | Plus Jakarta Sans, Poppins via `@remotion/google-fonts` |

---

## Appendix D — Handy commands (for your own timing reference only)

```bash
# Frame contact sheet of the reference (1 frame / 5 s)
ffmpeg -i reference.mp4 -vf "fps=1/5,scale=480:-1" frames/f_%03d.jpg

# Extract the reference audio ONLY to study timing/loudness. Don't publish it in your video
ffmpeg -i reference.mp4 -vn -ac 2 -ar 44100 reference_audio.wav

# Measure loudness of your final render (target ≈ -15.5 LUFS, true peak ≤ -1 dBTP)
ffmpeg -i out/uxp-demo.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -15

# Estimate tempo of a candidate music track
pip install librosa && python -c "import librosa;y,sr=librosa.load('track.mp3');print(librosa.beat.beat_track(y=y,sr=sr)[0])"
```
