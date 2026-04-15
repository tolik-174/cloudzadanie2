def generate_summary(transcript: str) -> str:
    text = transcript.strip()
    if len(text) <= 250:
        return text
    return text[:250] + "..."


def extract_action_items(transcript: str) -> str:
    parts = [part.strip() for part in transcript.split(".") if part.strip()]
    if not parts:
        return "- No action items detected"

    items = []
    for part in parts[:3]:
        items.append(f"- {part}")

    return "\n".join(items)