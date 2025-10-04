#!/usr/bin/env python3
"""Utility for inserting question items into the appropriate model data files.

Reads a JSON array of question objects (either from a --file argument or stdin),
then writes each question to the section file for every model listed under
`modelIds`.  If a section file does not yet exist it will be created, along with
an entry in the model's index.json so the app will surface the new chapter
automatically.

Each question is expected to match the structure already used in the project;
`manual` + `reference` fields are converted into a `references` array when
needed. Duplicate question ids are skipped.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List


REPO_ROOT = Path(__file__).resolve().parents[1]
MODEL_DATA_ROOT = REPO_ROOT / "public" / "model-data"


def load_questions(source: str) -> List[Dict[str, Any]]:
    try:
        data = json.loads(source)
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Kunne ikke tolke JSON data: {exc}")

    if isinstance(data, dict):
        questions = [data]
    elif isinstance(data, list):
        questions = data
    else:
        raise SystemExit("Forventet JSON-objekt eller liste med spørsmål")

    return questions


def section_title(section_id: str) -> str:
    overrides = {
        "limitations": "Limitations",
        "performance": "Performance",
        "procedures": "Procedures",
        "engine-systems": "Engine Systems",
        "engine-systems-quiz": "Engine Systems",
    }
    if section_id in overrides:
        return overrides[section_id]
    # Title case fallback
    return section_id.replace("-", " ").replace("_", " ").title()


def ensure_references(item: Dict[str, Any]) -> None:
    manual = item.get("manual")
    reference = item.get("reference")
    note = None
    if manual and reference:
        note = f"{manual} – {reference}"
    elif manual:
        note = manual
    elif reference:
        note = reference

    refs = item.get("references")
    if refs is None:
        item["references"] = [note] if note else []
        return

    if not isinstance(refs, list):
        refs_list = [str(refs)]
        if note and note not in refs_list:
            refs_list.append(note)
        item["references"] = refs_list
        return

    if note and note not in refs:
        refs.append(note)


def update_index(index_path: Path, section_id: str) -> None:
    if index_path.exists():
        with index_path.open("r", encoding="utf-8") as fh:
            try:
                index = json.load(fh)
            except json.JSONDecodeError:
                index = {}
    else:
        index = {}

    sections = index.get("sections")
    if not isinstance(sections, list):
        sections = []

    if any(entry.get("id") == section_id for entry in sections):
        # Already present – nothing to do
        index["sections"] = sections
        with index_path.open("w", encoding="utf-8") as fh:
            json.dump(index, fh, indent=2, ensure_ascii=False)
        return

    sections.append({
        "id": section_id,
        "title": section_title(section_id),
    })
    sections.sort(key=lambda entry: entry.get("id", ""))
    index["sections"] = sections

    with index_path.open("w", encoding="utf-8") as fh:
        json.dump(index, fh, indent=2, ensure_ascii=False)


def append_questions_for_variant(variant_id: str, questions: Iterable[Dict[str, Any]]) -> List[str]:
    base = MODEL_DATA_ROOT / variant_id
    if not base.exists():
        raise SystemExit(f"Fant ikke modellmappe for variant '{variant_id}'.")

    sections_dir = base / "sections"
    sections_dir.mkdir(parents=True, exist_ok=True)

    written_ids: List[str] = []

    for original in questions:
        section_id = original.get("section")
        qid = original.get("id")
        if not section_id or not qid:
            print(f"Hopper over spørsmål uten 'section' eller 'id': {original}")
            continue

        section_path = sections_dir / f"{section_id}.json"
        if section_path.exists():
            try:
                section_data = json.loads(section_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                section_data = {"items": []}
        else:
            section_data = {"items": []}

        items = section_data.get("items")
        if not isinstance(items, list):
            items = []

        if any(item.get("id") == qid for item in items):
            print(f"Spørsmål {qid} finnes allerede i {section_path}")
            continue

        question_copy = json.loads(json.dumps(original))
        ensure_references(question_copy)
        question_copy.setdefault("tags", [])
        items.append(question_copy)
        section_data["items"] = items

        section_path.write_text(json.dumps(section_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        update_index(base / "index.json", section_id)
        written_ids.append(qid)

    return written_ids


def main() -> None:
    parser = argparse.ArgumentParser(description="Legg til spørsmål i modell-data")
    parser.add_argument("--file", type=Path, help="Fil som inneholder JSON-data. Leser fra stdin dersom utelatt.")
    args = parser.parse_args()

    if args.file:
        source = args.file.read_text(encoding="utf-8")
    else:
        source = sys.stdin.read()
        if not source.strip():
            raise SystemExit("Ingen JSON funnet på stdin")

    questions = load_questions(source)

    # Grupper spørsmål per variant for effektivitet
    per_variant: Dict[str, List[Dict[str, Any]]] = {}
    for question in questions:
        model_ids = question.get("modelIds") or []
        if not isinstance(model_ids, list) or not model_ids:
            print(f"Hopper over spørsmål uten gyldige modelIds: {question}")
            continue
        for variant_id in model_ids:
            per_variant.setdefault(variant_id, []).append(question)

    if not per_variant:
        raise SystemExit("Ingen spørsmål å legge til")

    summary: Dict[str, List[str]] = {}
    for variant_id, items in per_variant.items():
        written = append_questions_for_variant(variant_id, items)
        if written:
            summary[variant_id] = written

    if not summary:
        print("Ingen nye spørsmål ble lagt til (muligens duplikater).")
        return

    print("La til spørsmål:")
    for variant_id, ids in summary.items():
        print(f"  {variant_id}: {', '.join(ids)}")


if __name__ == "__main__":
    main()
