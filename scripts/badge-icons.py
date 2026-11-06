"""Builds The Ridgwell Family's project icons (from StuxieDev's badge style): the family emblem on a round avatar with a badge in the bottom-right corner.
Usage: python -I scripts/badge-icons.py <family icon.png> <out dir> [social|projects|status ...]"""
import math, sys
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
S = 4                      # supersampling
N = 512 * S
BG = (6, 16, 51, 255)       # #061033, the family sites' dark background
PINK, PURPLE, BLUE = (126, 164, 255), (42, 107, 255), (31, 79, 209)   # Ridgwell blues: #7ea4ff, #2a6bff, #1f4fd1
WHITE = (255, 255, 255, 255)

emblem = Image.open(src).convert("RGBA")
avatar = None  # built below, after gradient()

def gradient(size):
    """A diagonal bi-flag gradient square."""
    g = Image.new("RGBA", (size, size))
    px = g.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            if t < 0.5:
                a, b, u = PINK, PURPLE, t / 0.5
            else:
                a, b, u = PURPLE, BLUE, (t - 0.5) / 0.5
            px[x, y] = tuple(round(a[i] + (b[i] - a[i]) * u) for i in range(3)) + (255,)
    return g

def round_base():
    """The family emblem on a round dark avatar inside a Ridgwell blue gradient ring."""
    base = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    m = Image.new("L", (N, N), 0)
    ImageDraw.Draw(m).ellipse((0, 0, N - 1, N - 1), fill=255)
    base.paste(gradient(N), (0, 0), m)
    ring = int(N * 0.04)
    ImageDraw.Draw(base).ellipse((ring, ring, N - 1 - ring, N - 1 - ring), fill=BG)
    w, h = emblem.size
    k = (N * 0.66) / max(w, h)
    e = emblem.resize((round(w * k), round(h * k)), Image.LANCZOS)
    base.alpha_composite(e, ((N - e.width) // 2 - int(N * 0.035), (N - e.height) // 2 - int(N * 0.04)))
    return base

avatar = round_base()

R = int(N * 0.205)          # badge radius
CX = CY = N - R - int(N * 0.01)
RING = int(N * 0.022)

def badge_base():
    layer = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    # soft shadow so the badge lifts off the avatar
    sh = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse((CX - R, CY - R + 6 * S, CX + R, CY + R + 6 * S), fill=(0, 0, 0, 120))
    layer = Image.alpha_composite(layer, sh.filter(ImageFilter.GaussianBlur(8 * S)))
    # bi-gradient ring, dark inside
    ring = gradient(2 * R)
    mask = Image.new("L", (2 * R, 2 * R), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, 2 * R - 1, 2 * R - 1), fill=255)
    layer.paste(ring, (CX - R, CY - R), mask)
    ImageDraw.Draw(layer).ellipse((CX - R + RING, CY - R + RING, CX + R - RING, CY + R - RING), fill=BG)
    return layer

def fediverse(d):
    """The Fediverse mark: five nodes on a pentagon, every pair joined."""
    r = R * 0.52
    pts = [(CX + r * math.cos(math.radians(-90 + 72 * i)), CY + r * math.sin(math.radians(-90 + 72 * i))) for i in range(5)]
    w = int(R * 0.055)
    for i in range(5):
        for j in range(i + 1, 5):
            d.line([pts[i], pts[j]], fill=(255, 255, 255, 200), width=w)
    colours = [PINK, PURPLE, BLUE, PURPLE, PINK]
    nr = R * 0.13
    for (x, y), c in zip(pts, colours):
        d.ellipse((x - nr - w, y - nr - w, x + nr + w, y + nr + w), fill=WHITE)
        d.ellipse((x - nr, y - nr, x + nr, y + nr), fill=c + (255,))

def chain(layer):
    """Two interlocking chain links, on a 45 degree slant."""
    size = 2 * R
    g = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(g)
    c = size / 2
    lw, lh = size * 0.46, size * 0.24       # one link's outer size
    t = int(size * 0.065)                    # stroke
    off = size * 0.155
    def link(x, colour):
        box = (x - lw / 2, c - lh / 2, x + lw / 2, c + lh / 2)
        d.rounded_rectangle(box, radius=lh / 2, outline=colour, width=t)
    link(c - off, WHITE)
    link(c + off, WHITE)
    # redraw part of the left link over the right one so they interlock
    over = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    od = ImageDraw.Draw(over)
    box = (c - off - lw / 2, c - lh / 2, c - off + lw / 2, c + lh / 2)
    od.rounded_rectangle(box, radius=lh / 2, outline=WHITE, width=t)
    clip = Image.new("L", (size, size), 0)
    ImageDraw.Draw(clip).rectangle((c, c - lh, c + lw, c), fill=255)
    gap = Image.new("L", (size, size), 0)
    ImageDraw.Draw(gap).rectangle((c, c - lh / 2 - t, c + lw, c), fill=255)
    # cut a gap in the right link where the left one passes over it, then draw the left link's segment
    g.putalpha(Image.composite(Image.new("L", (size, size), 0), g.getchannel("A"),
                               Image.composite(gap, Image.new("L", (size, size), 0),
                                               over.getchannel("A").point(lambda a: 255 if a else 0).filter(ImageFilter.MaxFilter(int(t * 0.6) | 1)))))
    g = Image.alpha_composite(g, Image.composite(over, Image.new("RGBA", (size, size)), clip))
    g = g.rotate(-45, resample=Image.BICUBIC)
    layer.alpha_composite(g, (CX - R, CY - R))

def stroke_glyph(layer, svg_paths):
    """Draws white strokes given in the 64-unit space of the house icons, scaled into the badge."""
    k = (2 * R * 0.62) / 40          # the glyphs span about 40 units
    ox, oy = CX - 32 * k, CY - 32 * k
    d = ImageDraw.Draw(layer)
    w = int(4.5 * k)
    def P(x, y): return (ox + x * k, oy + y * k)
    for kind, args in svg_paths:
        if kind == "poly":
            pts = [P(*p) for p in args]
            d.line(pts, fill=WHITE, width=w, joint="curve")
            for p in (pts[0], pts[-1]):
                d.ellipse((p[0] - w / 2, p[1] - w / 2, p[0] + w / 2, p[1] + w / 2), fill=WHITE)
        elif kind == "dot":
            x, y, r = args; c = P(x, y)
            d.ellipse((c[0] - r * k, c[1] - r * k, c[0] + r * k, c[1] + r * k), fill=WHITE)
        elif kind == "rrect":
            x0, y0, x1, y1, rad = args
            d.rounded_rectangle((*P(x0, y0), *P(x1, y1)), radius=rad * k, outline=WHITE, width=w)

def code(layer):   # < • >, the Projects site's own mark
    stroke_glyph(layer, [("poly", [(22, 20), (13, 32), (22, 44)]), ("poly", [(42, 20), (51, 32), (42, 44)]), ("dot", (32, 32, 4.5))])

def archive(layer):   # an archive box, as in the Archives logo
    stroke_glyph(layer, [("rrect", (14, 17, 50, 28, 3)), ("poly", [(17, 28), (17, 44), (19, 47), (45, 47), (47, 44), (47, 28)]), ("poly", [(27, 36), (37, 36)])])

def status(layer):   # a heartbeat line
    stroke_glyph(layer, [("poly", [(12, 34), (22, 34), (27, 22), (35, 46), (41, 30), (44, 34), (52, 34)])])

wanted = sys.argv[3:] or ["social", "links", "projects", "archives", "status"]
for key, name, draw in (("status", "ridgwell-status-icon.png", status),
                        ("social", "ridgwell-social-icon.png", "fediverse"), ("links", "ridgwell-links-icon.png", "chain"),
                        ("projects", "ridgwell-projects-icon.png", code), ("archives", "ridgwell-archives-icon.png", archive)):
    if key not in wanted:
        continue
    layer = badge_base()
    if draw == "fediverse":
        fediverse(ImageDraw.Draw(layer))
    elif draw == "chain":
        chain(layer)
    else:
        draw(layer)
    icon = Image.alpha_composite(avatar, layer).resize((256, 256), Image.LANCZOS)
    icon.save(f"{out}/{name}", optimize=True)
    print(name)
