# Studio-relight pass: segments the cake (GrabCut), then transforms the
# background into a soft, warm, bright studio backdrop with a gentle glow
# behind the subject. The cake itself is only very lightly graded — never
# repainted. Produces the depth-of-field look of professional food photos.
import cv2
import numpy as np
import os, sys

SRC = "_incoming/b38-photos-appetizing"
DST = "_incoming/b38-photos-studio"
os.makedirs(DST, exist_ok=True)

def cake_mask(img):
    h, w = img.shape[:2]
    mask = np.zeros((h, w), np.uint8)
    bgd = np.zeros((1, 65), np.float64)
    fgd = np.zeros((1, 65), np.float64)
    rect = (int(w*0.06), int(h*0.22), int(w*0.88), int(h*0.72))
    cv2.grabCut(img, mask, rect, bgd, fgd, 6, cv2.GC_INIT_WITH_RECT)
    m = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    # close holes + keep the largest blob (the cake), then feather
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    n, labels, stats, _ = cv2.connectedComponentsWithStats(m, 8)
    if n > 1:
        biggest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        m = np.where(labels == biggest, 255, 0).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_DILATE, np.ones((7, 7), np.uint8))
    m = cv2.GaussianBlur(m, (0, 0), 9)
    return m, m.mean() / 255.0  # coverage estimate

def studio_background(img, mask):
    h, w = img.shape[:2]
    bg = cv2.GaussianBlur(img, (0, 0), 28)
    lab = cv2.cvtColor(bg, cv2.COLOR_BGR2LAB).astype(np.float32)
    l, a, b = cv2.split(lab)
    l = l * 1.30 + 14          # bright, creamy
    a = a - 3.0                # slightly less green
    b = b + 6.0                # warm cream tint
    bg = cv2.cvtColor(np.clip(np.stack([l, a, b], -1), 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
    bg = cv2.cvtColor(bg, cv2.COLOR_BGR2HSV).astype(np.float32)
    hh, ss, vv = cv2.split(bg)
    ss = ss * 0.55             # muted backdrop, food pops in front
    bg = cv2.cvtColor(np.clip(np.stack([hh, ss, vv], -1), 0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR)
    # soft glow centered behind the cake
    yy, xx = np.mgrid[0:h, 0:w]
    cy, cx = mask.shape[0] / 2, mask.shape[1] / 2
    d = np.sqrt(((xx - cx) / w) ** 2 + ((yy - cy) / h) ** 2)
    glow = np.clip(1 - d * 1.7, 0, 1) ** 1.6
    bg = (bg * (1 - 0.28 * glow[..., None]) + np.array([235, 232, 244]) * 0.28 * glow[..., None]).astype(np.uint8)
    # vignette at edges
    vig = np.clip(1.06 - d * 0.55, 0.82, 1.06)
    bg = (bg * vig[..., None]).astype(np.uint8)
    return bg

def relight(img):
    mask, coverage = cake_mask(img)
    out = img.copy()
    if coverage > 0.86:
        return out, coverage  # too close-up: keep as-is
    bg = studio_background(img, mask)
    m3 = (mask.astype(np.float32) / 255.0)[..., None]
    out = (img.astype(np.float32) * m3 + bg.astype(np.float32) * (1 - m3)).astype(np.uint8)
    # warm the cake a touch (it now sits in warmer light)
    lab = cv2.cvtColor(out, cv2.COLOR_BGR2LAB).astype(np.float32)
    l, a, b = cv2.split(lab)
    a -= 1.0; b += 1.5
    out = cv2.cvtColor(np.clip(np.stack([l, a, b], -1), 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
    return out, coverage

only = sys.argv[1:] if len(sys.argv) > 1 else None
for f in sorted(os.listdir(SRC)):
    if not f.endswith(".jpg"):
        continue
    if only and not any(o in f for o in only):
        continue
    img = cv2.imread(os.path.join(SRC, f))
    out, cov = relight(img)
    cv2.imwrite(os.path.join(DST, f), out, [cv2.IMWRITE_JPEG_QUALITY, 93])
    print(f, f"coverage={cov:.2f}")
print("done")
