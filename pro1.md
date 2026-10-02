STOP. The current video is wrong. Discard the invented UI and the decorative animations. Rebuild it using the rules below. These override everything I said before.

1) THIS IS A PRODUCT DEMO, NOT A MOTION-GRAPHICS REEL
A viewer should finish it knowing exactly what UrbanXPixels does and how it works. Structure:
 - Hook (0–6s): one concrete pain ("Leads message you. Nobody replies fast enough.")
 - Solution (6–12s): what we build, in one sentence
 - 4 walkthroughs (~20–25s each): each is ONE real user goal done end-to-end
     (e.g. "Send a WhatsApp broadcast", "Capture a lead with a form + payment",
      "Route chats to agents", "See campaign analytics", "Launch a fast website")
     Each follows: problem → action → visible result.
 - Proof (8s): only the real numbers from the site (98% open rate, 45–60% click & reply, <1.2s load, 3x revenue, 50+ deployments)
 - CTA (6s): Get a Free Quote + urbanxpixels.com
Before coding, write the full script as a table: time | what is on screen | exact cursor action | caption text | sound cues. Show it to me and wait for approval.

2) USE THE REAL UI. NO MOCK UI
 - Read my code base at [PATH or LOCALHOST URL]. Do not redraw screens from imagination.
 - Method A (preferred): run the real app and capture it with Playwright at 1080x1920 (mobile) and 1920x1080 (desktop), recording the real interaction as video or frame sequence, with deterministic demo data.
 - Method B: where components are presentational, import the real components into Remotion with mock props.
 - For every capture, export a JSON of bounding boxes for each element I interact with (buttons, inputs, tabs, cards). Remotion reads this file.
 - Real site assets (feature-whatsapp-broadcast, feature-whatsapp-forms, feature-live-chat, feature-analytics, website-hero, uxplogo.svg) are used as-is.
 - If a screen I need doesn't exist in the code, tell me. Don't invent it.

3) THE CURSOR IS DRIVEN BY AN ACTION SCRIPT
 - One file, actions.json, is the single source of truth:
   [{ t, type: "move|click|type|scroll|hold", target: "<element id from bbox JSON>", text?, caption?, sfx? }]
 - The cursor can ONLY move to the center of a real element's bounding box from that JSON. It can never click empty space.
 - Every click must cause a visible state change in the recording (tab switches, modal opens, message sends). If a click does nothing, remove it.
 - Path: smooth bezier, ease in/out, 0.6–0.9s per move, small press-scale, subtle ripple. The camera pushes in toward the target before the click and pulls back after.
 - Add a build check: render a still at every click frame and fail if the cursor tip is outside the target bounding box.

4) CAPTIONS (required)
 - Burned-in captions in the bottom safe zone (y 1380–1650 on 1080x1920), max 2 lines, 7 words per line, 64px+, high contrast with soft background pill.
 - Word-by-word highlight of the current word in the accent colour, synced to timing (use @remotion/captions; generate timings from the voiceover with Whisper, or from the script if no voiceover).
 - Add short callout labels that point at real UI elements ("Official WhatsApp API", "Razorpay checkout", "Live in 48h"), with a line that draws to the element's bounding box, appearing 0.3s before the cursor arrives.
 - One idea per caption. Captions explain what the cursor is doing, never repeat the screen text.

5) SOUND DESIGN IS GENERATED FROM actions.json
 - Each action type maps to a sound automatically, so sound always matches what's on screen:
     click → layered click (down tick + soft up tick)
     type → quiet keyboard-typing loop for the exact typing duration
     scroll/swipe → short air swipe
     scene change / camera push → whoosh with a rising pitch
     headline reveal → low sub-hit + soft riser (0.6s) before it
     message sent/received → soft chat pop
     success (payment, form done, stat count-up) → one glassy chime
 - I will give you real SFX files in public/sfx/ (clicks, keys, whooshes, risers, sub-hits, chimes, pops). Use them. Do not synthesise placeholder beeps. If a file is missing, list what's needed and stop.
 - Per-sound variation: ±5% pitch, ±1.5dB. Light shared reverb on a send bus so they sit with the music.
 - Music: one steady bed at ~123 BPM, ducked −3 to −4dB under whooshes, sub-hits and voice. Final mix about −15 LUFS, true peak ≤ −1 dBTP.
 - Silence is allowed. Not every action needs a sound. Max 2 sounds at once.

6) VISUAL STYLE
 - Clean white UI on the soft mint gradient. Real UI at large scale, cropped by the frame. Soft layered shadows. No floating random icons, no bouncing, no spinning, no neon.
 - Motion only to guide the eye or show state change: camera pushes, element highlights, smooth scene-to-scene morphs.

7) PROCESS
 a) Show me the script table (step 1) and the list of captures you'll record. Wait for my OK.
 b) Build ONE walkthrough first, with real UI, cursor, captions, SFX. Render a 20s preview and a contact sheet with the cursor-in-bbox check results. Wait for my feedback.
 c) Only then build the rest.