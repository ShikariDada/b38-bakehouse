# Batch v2: rotate across public FLUX.1-Kontext spaces, each with its own
# anonymous ZeroGPU quota. Resumable: existing outputs are skipped.
import os, time, shutil
from gradio_client import Client, handle_file

SRC = "_incoming/b38-photos-appetizing"
DST = "_incoming/b38-photos-ai"
PROMPT = (
    "Professional food photography edit for a bakery website. Keep the cake itself "
    "ABSOLUTELY IDENTICAL: same shape, same frosting colors, same decorations, same "
    "piped text, same board. Only transform the setting: replace the background with "
    "a clean warm cream studio backdrop with a soft radial gradient, add soft "
    "professional lighting with a gentle shadow under the board, warmer and slightly "
    "more vibrant appetizing tones. Photorealistic, high-end patisserie catalogue style."
)
SPACES = [
    "black-forest-labs/FLUX.1-Kontext-Dev",
    "Nymbo/FLUX.1-Kontext-Dev",
    "1v1/kontextflux",
    "kontext-community/FLUX.1-Kontext-multi",
    "joztt31/black-forest-labs-FLUX.1-Kontext-dev",
    "Swagcrew/black-forest-labs-FLUX.1-Kontext-dev",
    "Gvqlo10c/black-forest-labs-FLUX.1-Kontext-dev",
]
os.makedirs(DST, exist_ok=True)

clients = {}
dead = set()

def client_for(space):
    if space in clients:
        return clients[space]
    c = Client(space, verbose=False)
    clients[space] = c
    return c

files = sorted(f for f in os.listdir(SRC) if f.endswith(".jpg"))
print("total:", len(files), flush=True)

for i, f in enumerate(files):
    out_path = os.path.join(DST, f)
    if os.path.exists(out_path):
        print("skip", f, flush=True)
        continue
    done = False
    for space in SPACES:
        if space in dead:
            continue
        for attempt in range(2):
            try:
                t0 = time.time()
                r = client_for(space).predict(
                    handle_file(os.path.join(SRC, f)),
                    PROMPT,
                    42 + i,
                    False,
                    4,
                    20,
                    api_name="/infer",
                )
                src = r[0] if isinstance(r, (list, tuple)) else r
                if hasattr(src, "path"):
                    src = src.path
                shutil.copy(str(src), out_path)
                print(f"ok [{space.split('/')[-1]}] {f} {time.time()-t0:.0f}s", flush=True)
                done = True
                break
            except Exception as e:
                msg = str(e)
                print(f"  miss [{space.split('/')[-1]}] {f}: {msg[:90]}", flush=True)
                if "quota" in msg.lower() or "GPU" in msg.upper() or "RUNTIME_ERROR" in msg or "invalid state" in msg:
                    dead.add(space)
                    print("  -> space quota exhausted, rotating", flush=True)
                    break
                if clients.get(space):
                    clients.pop(space)
                time.sleep(6)
        if done:
            break
    if not done:
        print("FAILED", f, flush=True)
print("batch done", flush=True)
