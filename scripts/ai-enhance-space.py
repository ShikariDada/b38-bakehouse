# Cloud-AI photo enhancement via HuggingFace Spaces (no login): instruction-based
# editors (Qwen-Image-Edit / FLUX Kontext class) that preserve the cake while
# transforming background, lighting and colour.
import sys, os, shutil, time
from gradio_client import Client, handle_file

SRC = "_incoming/b38-photos-appetizing"
DST = "_incoming/b38-photos-ai"
SPACES = [
    "Qwen/Qwen-Image-Edit",
    "multimodalart/Qwen-Image-Edit-Fast",
    "black-forest-labs/FLUX.1-Kontext-Dev",
]
PROMPT = (
    "Professional food photography edit for a bakery website. Keep the cake itself "
    "ABSOLUTELY IDENTICAL: same shape, same frosting colors, same decorations, same "
    "piped text, same board. Only transform the setting: place it against a clean warm "
    "cream studio backdrop with a soft radial gradient, add soft professional lighting "
    "with a gentle shadow under the board, slightly warmer and more vibrant appetizing "
    "tones. Photorealistic, high-end patisserie catalogue style."
)

def get_client():
    for space in SPACES:
        for attempt in range(2):
            try:
                print("connecting:", space, flush=True)
                c = Client(space, verbose=False)
                # discover the api
                api = c.view_api(return_format="dict", print_info=False)
                return c, space, api
            except Exception as e:
                print("  fail:", str(e)[:120], flush=True)
                time.sleep(3)
    return None, None, None

def pick_endpoint(c):
    """Find the main predict endpoint + which args accept an image and a prompt."""
    info = c.view_api(return_format="dict", print_info=False)
    named = info.get("named_endpoints", {})
    ep = "/predict" if "/predict" in named else next(iter(named), None)
    if not ep:
        raise RuntimeError("no endpoints")
    params = named[ep]["parameters"]
    img_idx = [i for i, p in enumerate(params) if "image" in p.get("type", {}).get("type", "") or "Image" in str(p.get("type"))]
    return ep, params, img_idx

def main():
    only = set(sys.argv[1:]) or None
    os.makedirs(DST, exist_ok=True)
    c, space, _ = get_client()
    if not c:
        print("NO_SPACE_AVAILABLE")
        return
    ep, params, _ = pick_endpoint(c)
    print("endpoint:", ep, "| params:", [(p["label"], p.get("type")) for p in params])
    files = sorted(f for f in os.listdir(SRC) if f.endswith(".jpg"))
    if only:
        files = [f for f in files if any(o in f for o in only)]
    for f in files:
        src_path = os.path.join(SRC, f)
        out_path = os.path.join(DST, f)
        if os.path.exists(out_path):
            continue
        try:
            kw = {}
            # generic mapping: first image param gets the file, first text param gets the prompt
            import gradio_client as gc
            fn = c.predict if ep == "/predict" else None
            # use the generic call signature: positional args in parameter order
            args = []
            used_img = False
            used_txt = False
            for p in params:
                t = str(p.get("type"))
                if not used_img and ("Image" in t or "image" in str(p.get("component"))):
                    args.append(handle_file(src_path)); used_img = True
                elif not used_txt and p.get("parameter_name") in ("prompt", "instruction", "text", "edit_instruction") or "str" in t and not used_txt and p.get("parameter_default") in (None, ""):
                    args.append(PROMPT); used_txt = True
                else:
                    args.append(p.get("parameter_default"))
            result = c.predict(*args, api_name=ep)
            # result may be a filepath/tuple/dict
            out_file = None
            if isinstance(result, str):
                out_file = result
            elif isinstance(result, (list, tuple)) and result:
                out_file = result[0] if isinstance(result[0], str) else (result[0].url if hasattr(result[0], "url") else None)
            elif hasattr(result, "url"):
                out_file = result.url
            elif isinstance(result, dict):
                out_file = result.get("image") or result.get("output")
            if out_file and os.path.exists(str(out_file)):
                shutil.copy(str(out_file), out_path)
                print("ok", f, flush=True)
            else:
                print("no-file", f, str(result)[:100], flush=True)
        except Exception as e:
            print("err", f, str(e)[:160], flush=True)
            time.sleep(2)

if __name__ == "__main__":
    main()
