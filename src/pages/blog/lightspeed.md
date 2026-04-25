---
title: "Lightspeed writeup: Proxy Detection"
pubDate: 2026-04-24
description: "Are they maturing, or still really stupid?"
layout: "../../layouts/BlogLayout.astro"
---

Alright, so as of writing this, **Lightspeed** released an update a couple days ago that introduced proxy detection. Do I really care? Nah, not really, but I am digging into this because it's interesting.

---

## What's Being Detected?

So, what do they detect? Well, **UV** is a big one. UV is basically one of the big proxy libraries that essentially everyone uses. Funny enough, I think they actually read bundle source code for this one. Here's the full list:

- **UV** (prefix, file paths, bundle functions like `rewriteJS`, `rewriteCSS`, etc)
- **Scramjet** (Controller, init function, `$scramjet` prefix)
- **Baremux/BareClient** (this one's a bit odd — while it's used as a major dependency, it makes use of shared workers for big parts of it, so do they inspect other contexts now??)
- **Fern proxy** (frontend, but really popular, decent code obfuscation)
- **Daydream** (WHAT??? No, but seriously, they have 3 sets of detection just for my site: static detection, my proxy filepaths, and some of the naming and SEO)
- **RH** (Rammerhead is lowkey dead but still has some detection)
- Other misc and deprecated proxies

> Wow, so the entire community is really fucked then?

Ehh, I think in some ways it's a good thing. The average person is putting an interface over UV, adding some games, and calling it a day. There's not a whole lot of attempt at improving. At the end of the day, the people who stay relevant will be the people who understand things like obfuscation methods.

---

## UV Detection

So anyways, let's get into specifics. What's detected for **UV**?

Okay, so Lightspeed actually read the UV source for this one, which is a first. Let's go over it.

We ofc have the normal file path detection which can be found pretty easily (I'm using Lightspeed Filter Helper for Windows for code reference). List is below for the basic stuff:

```regex
/^__uv/
uv-iframe
/\/uv\//i
/\/ultraviolet\//i
/uv\.config\.js/i
/uv\.bundle\.js/i
/uv\.sw\.js/i
/uv\.handler\.js/i
/uv\.sw-handler\.js/i
/\/ultraviolet\/sw/i
/__uv\$/
/uvConfig\s*=/
/new\s+BareClient/
/encodeUrl\s*\(/
/decodeUrl\s*\(/
/__uv\$config/
/ultraviolet/i
```

But after doing further investigation, it appears they started listing the main functions for the UV rewriter bundle and SW register in their regex and more (code snippet below from their obfuscated code):

```js
_0x620e35 = [
    /rewriteHTML\s*\(/,
    /rewriteCSS\s*\(/,
    /rewriteJS\s*\(/,
    /rewriteUrl\s*\(/,
    /proxyUrl\s*\(/,
    /unproxyUrl\s*\(/,
    /navigator\.serviceWorker\.register\s*\(\s*['"].*(?:sw|service[-_]?worker|uv|scramjet|bare)/i,
],
```

Any concerns there?? Yea, the devs start flagging registrations of `sw.js` — which is a normal filename, as service workers are used for caching among other uses. Kinda janky detection.

However, it gets worse...

---

## Native Function Limits

It appears Lightspeed checks for 2 native JS functions built into the runtime by default: **`atob()`** and **`eval()`**. Why is this concerning? Because you can only call `atob` **8 times** and `eval` only **3 times** before it starts flagging. It's borderline schizophrenia.

---

## Bare-Mux Detection

Now, setting those aside, they also have **bare-mux** detection that's pretty good. Bare-mux being the main networking and message layer for most modern day web proxies, this becomes problematic. **Epoxy**, **libcurl**, **Wisp**, and **Bare** are partially caught too.

Below are the code snippets hosting the regex and snippets to detect:

```js
_0x34cb18 = [
    /BareClient\.prototype/,
    /new\s+BareClient/,
    /BareMuxConnection/,
    /setTransport\s*\(/,
    /BroadcastChannel\s*\(\s*['"]bare-mux['"]/,
],

var _0x1c6614 = _0x5589b6["value"];
if (!_0x1c6614) continue;
(/bare[-_]?mux/i[_0x191a4c(0x259)](_0x1c6614) ||
/bare[-_]?client/i["test"](_0x1c6614)) &&
((_0x2460b9 += 0x14),
_0x175e71["push"](_0x191a4c(0x4ac)["concat"](_0x1c6614)));

_0x175e71[_0x191a4c(0x65a)](
    "BareMux\x20attribute:\x20"[_0x191a4c(0x596)](
        _0x2e2e06[_0x191a4c(0x2d9)],
    ),
)

_0x3c6f54 = [
    /\/baremux\//i,
    /\/bare-mux\//i,
    /baremux\/worker\.js/i,
    /\/libcurl\//i,
    /\/epoxy\//i,
    /bare\.cjs/i,
    /bare-mux\.js/i,
    /libcurl\.js/i,
    /epoxy\.js/i,
],

_0x5d70f1 = [
    /BareMux\.BareMuxConnection/,
    /new\s+BareMux\.BareClient/,
    /setTransport\s*\(/,
    /BroadcastChannel\s*\(\s*['"]bare-mux['"]\s*\)/,
    /wisp:/,
    /bare-mux/,
    /BareMuxConnection/,
    /libcurl.*transport/i,
    /epoxy.*transport/i,
],

_0x5575db = [
    /^bare-mux/i,
    /^baremux/i,
    /bare-mux-path/i,
    /bare-mux-transport/i,
    /baremux-config/i,
],

_0x4d6115 = [/libcurl/i, /epoxy/i, /wisp/i, /bare.*transport/i];
```

So what does that mean? Essentially, the entire networking layer of our beloved web proxies is detected. So that's "great."

> Does this mean we need new protocols??

Nah, it's mostly function names and file names there. Heavy obfuscation in multiple parts of the build step will help, but it gets 10x more complicated at this point.

---

## Scramjet Detection

Alright, so we're fucked with that, but you said there's way more???

Yea, atp there's a lot, so let's continue to go through it. **Scramjet**? Detected. Code below:

```js
 _0x3e6e70 = [
    /\/scram\//i,
    /\/scramjet/i,
    /scramjet\.wasm/i,
    /scramjet\.all\.js/i,
    /scramjet\.worker\.js/i,
    /scramjet\.shared\.js/i,
    /scramjet\.codecs/i,
],
_0x3f2eaa = [
    /ScramjetController/,
    /scramjet\.init\s*\(/,
    /scramjet\.createFrame\s*\(/,
    /scramjet\.encodeUrl/,
    /\$scramjet/,
    /scramjet\.config/i,
    /scramjet\.codec/i,
],
_0x3382b1 = [_0x13a34e(0x72b), "scramjet-frame", _0x13a34e(0x73b)],
 _0x87193b = [
    _0x13a34e(0x66d),
    ".scram-frame",
    ".scramjet-container",
],
_0x51b67e = [/scramjet.*\.wasm/i, /scram.*codec.*\.wasm/i],
_0x1db234 = [/^scramjet/i, /^scram[-_]/i, /scramjet[-_]config/i];

var _0x1f0855 = _0x1ba0bc[_0x1d203c(0xf3)];
    if (!_0x1f0855) continue;
    (/scramjet/i[_0x1d203c(0x259)](_0x1f0855) ||
        /scram[-_]frame/i["test"](_0x1f0855))

_0x2f1c41 = [
    /ScramjetController/,
    /scramjet\.init\s*\(/,
    /scramjet\.createFrame/,
    /scramjet\.encodeUrl/,
    /\$scramjet/,
],
```

Atp it's self explanatory — more code and files added to their detection.

---

## Daydream & Fern

Okay, now you mention **Daydream**???

Yea. Daydream is my passion project, formerly known as daydreamx. It's my attempt at a browser-like environment under a browser, pushing limits of JavaScript and whatnot. So them writing detection was kinda crazy.

So what do they detect? Mostly my UV and Scram paths, and the daydream name. I'm working on fixes for it, so I'm not gonna list it, as it'll be irrelevant.

**Fern**, I'm sure, is also doing the same.

Legacy stuff I'm not gonna list either really? It's PHProxy and Glype. That stuff hasn't been used in like 6 years. It's irrelevant.

---

## Closing Thoughts

So what does this mean? Well, it means Lightspeed got so concerned about web proxies, they gave themselves mental illness and even started blocking and flagging normal words. Scary. They already keylog and save student's usernames and passwords, now we're just breaking websites. Tell me, how the hell is a student supposed to learn then??? I used to be in public school, I'm pretty sure I've seen Google get blocked before. Google... yea, the search engine, the one everyone uses??? Being able to search for information is important to education. Some mixed feelings about this entire patch. I haven't seen any major enough code changes hosting proxy identifiers in the filter agent, but I assume they hide that in WASM now. So can't really tell ya, idk.

> "I'm a student who uses proxies as I don't have personal devices at home, and it allows me to get some stuff done, what can I do???"

Nothing at the moment. No one really has true patches for this yet. So it's kinda chaos trying to write a patch for all of this. But there's definitely going to be less proxies after this.

Anyway, that's what I have for now. There may be a part 2, but idk man.
