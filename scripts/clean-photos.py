# Removes the B38 watermark (top-right) from album photos via inpainting,
# then applies gentle, honest enhancement: exposure lift for dark frames, soft sharpen.
# Output: _incoming/b38-photos-cleaned/ (the media pipeline prefers these).
import cv2
import numpy as np
import os, sys

SRC = "_incoming/b38-photos"
DST = "_incoming/b38-photos-cleaned"
os.makedirs(DST, exist_ok=True)

WATERMARKED = {2, 5, 6, 7, 13, 14, 16, 17}  # photos carrying the white logo top-right

def remove_watermark(img):
    h, w = img.shape[:2]
    # logo always sits in the top-right corner; tight boxes avoid touching cake decor.
    # WhatsApp-compressed narrow frames (681px) carry the logo slightly further left.
    if w < 898:
        x0, y1 = int(w * 0.60), int(h * 0.22)
    else:
        x0, y1 = int(w * 0.66), int(h * 0.24)
    roi = img[0:y1, x0:w]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    # the logo is near-pure white on dark backgrounds; letters are small so keep area>=80
    mask_roi = (gray > 170).astype(np.uint8) * 255
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask_roi, 8)
    final = np.zeros_like(mask_roi)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] >= 80:
            final[labels == i] = 255
    if cv2.countNonZero(final) < 400:
        return img, False
    # dilate so the halo around the logo is covered
    final = cv2.dilate(final, np.ones((11, 11), np.uint8), iterations=3)
    mask = np.zeros((h, w), np.uint8)
    mask[0:y1, x0:w] = final
    out = cv2.inpaint(img, mask, 7, cv2.INPAINT_TELEA)
    return out, True

def enhance(img):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    mean_l = l.mean()
    if mean_l < 60:  # very dark frames: gentle lift, protect highlights
        l = np.clip(l * 1.18 + 4, 0, 255).astype(np.uint8)
    elif mean_l < 85:
        l = np.clip(l * 1.08 + 2, 0, 255).astype(np.uint8)
    lab = cv2.merge([l, a, b])
    out = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    # mild sharpening
    blur = cv2.GaussianBlur(out, (0, 0), 1.2)
    out = cv2.addWeighted(out, 1.18, blur, -0.18, 0)
    return out

count = 0
for f in sorted(os.listdir(SRC)):
    if not f.endswith(".jpg"):
        continue
    num = int(f.split("-")[1].split(".")[0])
    img = cv2.imread(os.path.join(SRC, f))
    if num in WATERMARKED:
        img, did = remove_watermark(img)
        count += did
    img = enhance(img)
    cv2.imwrite(os.path.join(DST, f), img, [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(f"{f}: cleaned={num in WATERMARKED}")
print(f"watermarks removed: {count}")
