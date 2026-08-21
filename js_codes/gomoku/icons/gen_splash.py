import base64
import subprocess
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ICON_PATH = os.path.join(HERE, "icon-512.png")
BG = "#f1f5f9"

with open(ICON_PATH, "rb") as f:
    icon_b64 = base64.b64encode(f.read()).decode("ascii")

# (css_width, css_height, dpr, label)
devices = [
    (375, 667, 2, "iphone-375x667"),
    (414, 896, 2, "iphone-414x896-2x"),
    (375, 812, 3, "iphone-375x812"),
    (414, 896, 3, "iphone-414x896-3x"),
    (390, 844, 3, "iphone-390x844"),
    (393, 852, 3, "iphone-393x852"),
    (428, 926, 3, "iphone-428x926"),
    (430, 932, 3, "iphone-430x932"),
    (768, 1024, 2, "ipad-768x1024"),
    (810, 1080, 2, "ipad-810x1080"),
    (834, 1112, 2, "ipad-834x1112"),
    (834, 1194, 2, "ipad-834x1194"),
    (1024, 1366, 2, "ipad-1024x1366"),
    (744, 1133, 2, "ipad-744x1133"),
    (820, 1180, 2, "ipad-820x1180"),
]

svg_tmpl = """<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <rect x="0" y="0" width="{w}" height="{h}" fill="{bg}"/>
  <image x="{ix}" y="{iy}" width="{isz}" height="{isz}" href="data:image/png;base64,{b64}"/>
</svg>"""

out_dir = os.path.join(HERE, "splash")
os.makedirs(out_dir, exist_ok=True)

for cw, ch, dpr, label in devices:
    for orientation, (pw, ph) in (
        ("portrait", (cw * dpr, ch * dpr)),
        ("landscape", (ch * dpr, cw * dpr)),
    ):
        isz = int(min(pw, ph) * 0.32)
        ix = (pw - isz) // 2
        iy = (ph - isz) // 2
        svg = svg_tmpl.format(w=pw, h=ph, bg=BG, ix=ix, iy=iy, isz=isz, b64=icon_b64)
        svg_path = os.path.join(out_dir, f"tmp-{label}-{orientation}.svg")
        png_path = os.path.join(out_dir, f"{label}-{orientation}.png")
        with open(svg_path, "w") as f:
            f.write(svg)
        subprocess.run(["rsvg-convert", "-w", str(pw), "-h", str(ph), svg_path, "-o", png_path], check=True)
        os.remove(svg_path)

print(f"Generated {len(devices) * 2} splash images in {out_dir}")

# Also emit the <link> tags with correct media queries for reference
lines = []
for cw, ch, dpr, label in devices:
    for orientation in ("portrait", "landscape"):
        w, h = (cw, ch) if orientation == "portrait" else (ch, cw)
        media = (
            f"(device-width: {w}px) and (device-height: {h}px) "
            f"and (-webkit-device-pixel-ratio: {dpr}) and (orientation: {orientation})"
        )
        lines.append(
            f'<link rel="apple-touch-startup-image" media="{media}" '
            f'href="icons/splash/{label}-{orientation}.png">'
        )

with open(os.path.join(out_dir, "splash-links.html"), "w") as f:
    f.write("\n".join(lines) + "\n")

print("Wrote link tags to splash/splash-links.html")
