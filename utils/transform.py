import csv, json, os
from collections import defaultdict

# Rutas relativas: el CSV debe estar junto a este script.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(SCRIPT_DIR, "schema.csv")
OUT = os.path.join(SCRIPT_DIR, "..", "src", "graph.json")  # Vite sirve desde src/

rows = []
with open(SRC, encoding="utf-8") as f:
    for r in csv.DictReader(f):
        rows.append(r)

conectores = {r["id"]: r["Área de texto 1"].strip()
              for r in rows
              if r["Biblioteca de figuras"].startswith("Figuras de diagrama de flujo")}
bloques    = {r["id"]: r["Área de texto 1"].strip()
              for r in rows
              if r["Nombre"] == "Bloque"}

edges = []
for r in rows:
    if r["Nombre"] == "Línea":
        s, t = r["Origen de línea"], r["Destino de la línea"]
        if s and t:
            edges.append((s, t, r["Área de texto 1"].strip()))

edges_cc = []                          # Conector -> Conector
edges_cb = defaultdict(list)           # Conector -> [Bloque] (directos)
edges_bb = defaultdict(list)           # Bloque   -> [Bloque] (cadenas)

# Tratamos las líneas como NO dirigidas para encadenar Bloques
# (Lucidchart no siempre te deja dibujar en el sentido "lógico").
for s, t, lbl in edges:
    s_c, t_c = s in conectores, t in conectores
    s_b, t_b = s in bloques, t in bloques
    if s_c and t_c:
        edges_cc.append((s, t, lbl))
    elif s_c and t_b:
        edges_cb[s].append(t)
    elif s_b and t_c:
        edges_cb[t].append(s)
    elif s_b and t_b:
        edges_bb[s].append(t)
        edges_bb[t].append(s)

# BFS desde cada Conector siguiendo cadenas de Bloques.
# Esto recoge no solo los Bloques directamente conectados sino también
# los que cuelgan en cadena (ej: Conector->B1->B2->B3 atrapa B2 y B3).
bloques_de_conector = defaultdict(list)
asignados = set()

for cid in conectores:
    visitados = set()
    cola = list(edges_cb.get(cid, []))
    while cola:
        bid = cola.pop(0)
        if bid in visitados or bid in asignados:
            continue
        visitados.add(bid)
        asignados.add(bid)
        bloques_de_conector[cid].append({"id": bid, "text": bloques[bid]})
        # Sigue la cadena Bloque->Bloque
        for siguiente in edges_bb.get(bid, []):
            if siguiente not in visitados:
                cola.append(siguiente)

# Diagnóstico
ids_atados = set()
for blist in bloques_de_conector.values():
    for b in blist:
        ids_atados.add(b["id"])

huerfanos = [(bid, txt) for bid, txt in bloques.items() if bid not in ids_atados]

root_id = next((cid for cid, n in conectores.items()
                if "Gestion de la seguridad de la informacion" in n), None)

print(f"Conectores: {len(conectores)}  |  Bloques: {len(bloques)}")
print(f"Edges totales: {len(edges)}  |  C->C: {len(edges_cc)}")
print(f"Bloques atados: {len(ids_atados)}  |  Huerfanos: {len(huerfanos)}")
print(f"Root: {root_id} -> {conectores.get(root_id)}\n")

print("=== HUERFANOS (id + primeros 80 chars del contenido) ===")
for bid, txt in huerfanos:
    preview = txt.replace("\n", " | ")[:80]
    print(f"  id={bid}  ->  {preview}")

out = {
    "root": root_id,
    "nodes": [{"id": cid,
               "label": name,
               "footnotes": [b["text"] for b in bloques_de_conector.get(cid, [])]}
              for cid, name in conectores.items()],
    "edges": [{"source": s, "target": t, "label": lbl} for s, t, lbl in edges_cc],
}

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print(f"\n-> {OUT} escrito")
