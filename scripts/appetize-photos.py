# Appetite-grade photo pass: brighter, warmer, more vibrant — the way cakes
# should look on screen. Protects frosting whites from clipping.
import cv2
import numpy as np
import os

SRC = "_incoming/b38-photos-cleaned"
DST = "_incoming/b38-photos-appetizing"
os.makedirs(DST, exist_ok=True)

def appetize(img):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    l, a, b = cv2.split(lab)
    mean_l = l.mean()
    # brightness lift: dark frames rise more, targets a mean around 100
    if mean_l < 55:
        l *= 1.34
    elif mean_l < 75:
        l *= 1.22
    elif mean_l < 95:
        l *= 1.12
    else:
        l *= 1.05
    l = np.clip(l, 0, 246)  # protect frosting highlights from blowing out
    # warmth: push toward red/yellow slightly (a down, b up in LAB)
    a = a - 2.0
    b = b + 3.5
    lab = cv2.merge([l, a, b]).astype(np.uint8)
    out = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    # vibrance: boost saturation more where it is low (protects already-vivid cake colors)
    hsv = cv2.cvtColor(out, cv2.COLOR_BGR2HSV).astype(np.float32)
    h, s, v = cv2.split(hsv)
    s = s * (1 + (1 - s / 255.0) * 0.22)  # low-sat pixels boosted most
    s = np.clip(s, 0, 255).astype(np.uint8)
    out = cv2.cvtColor(cv2.merge([h, s, v]).astype(np.uint8), cv2.COLOR_HSV2BGR)
    # gentle S-curve for contrast
    lut = np.array([max(0, min(255, int(255 * (x / 255) ** 0.94))) for x in range(256)], dtype=np.uint8)
    out = cv2.LUT(out, lut)
    # soft sharpen
    blur = cv2.GaussianBlur(out, (0, 0), 1.1)
    out = cv2.addWeighted(out, 1.15, blur, -0.15, 0)
    return out

for f in sorted(os.listdir(SRC)):
    if not f.endswith(".jpg"):
        continue
    img = cv2.imread(os.path.join(SRC, f))
    cv2.imwrite(os.path.join(DST, f), img, [cv2.IMWRITE_JPEG_QUALITY, 93])
    print(f, "appetized")
print("done")
