# Moody-luxe grade pass v2: adaptive per photo, correctly warm.
import cv2
import numpy as np
import os

SRC = "_incoming/b38-photos-cleaned"
DST = "_incoming/b38-photos-graded"
os.makedirs(DST, exist_ok=True)

def grade(img):
    h, w = img.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy = w * 0.5, h * 0.46
    d = np.sqrt(((xx - cx) / (w * 0.62)) ** 2 + ((yy - cy) / (h * 0.55)) ** 2)
    center = np.clip(1 - d, 0, 1) ** 1.3

    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    l, a, b = cv2.split(lab)
    mean_l = float(l.mean())

    # adaptive exposure: darker frames get pushed harder toward the target range
    if mean_l < 60:
        l = l * 1.30 + 8
    elif mean_l < 80:
        l = l * 1.20 + 5
    elif mean_l < 100:
        l = l * 1.10 + 3
    else:
        l = l * 1.04

    # shadow lift: dark background becomes rich chocolate, never black
    shadow = np.clip(1 - l / 115.0, 0, 1) ** 1.25
    l = l + shadow * 14

    # softbox glow on the cake
    l = l + center * 10
    l = np.clip(l, 0, 247)

    # WARMTH: red (a+) and yellow (b+). No global cooling anywhere.
    a = a + 2.5
    b = b + 6.0
    a = np.clip(a, 0, 255)
    b = np.clip(b, 0, 255)

    out = cv2.cvtColor(np.stack([l, a, b], -1).astype(np.uint8), cv2.COLOR_LAB2BGR)

    # vibrance: low-sat pixels boosted most, frosting whites untouched
    hsv = cv2.cvtColor(out, cv2.COLOR_BGR2HSV).astype(np.float32)
    hs, ss, vv = cv2.split(hsv)
    ss = ss * (1 + (1 - ss / 255.0) * 0.22)
    out = cv2.cvtColor(np.clip(np.stack([hs, ss, vv], -1), 0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR)

    # gentle S-curve
    lut = np.array([max(0, min(255, int(255 * ((x / 255) ** 0.93)))) for x in range(256)], dtype=np.uint8)
    out = cv2.LUT(out, lut)

    # depth: mild edge defocus only
    soft = cv2.GaussianBlur(out, (0, 0), 1.8)
    edge = np.clip(d - 0.35, 0, 1) / 0.65
    edge = (edge ** 1.5)[..., None]
    out = (out * (1 - edge * 0.42) + soft * edge * 0.42).astype(np.uint8)

    # micro sharpen
    blur = cv2.GaussianBlur(out, (0, 0), 0.8)
    out = cv2.addWeighted(out, 1.1, blur, -0.1, 0)
    return out

for f in sorted(os.listdir(SRC)):
    if not f.endswith(".jpg"):
        continue
    img = cv2.imread(os.path.join(SRC, f))
    cv2.imwrite(os.path.join(DST, f), grade(img), [cv2.IMWRITE_JPEG_QUALITY, 94])
    print(f, "graded")
print("done")
