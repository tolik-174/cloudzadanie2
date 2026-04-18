from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_summary(transcript: str):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role":"system","content":"Summarize this meeting briefly."},
            {"role":"user","content":transcript}
        ]
    )
    return response.choices[0].message.content


def extract_action_items(transcript: str):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role":"system","content":"Extract action items as bullet points."},
            {"role":"user","content":transcript}
        ]
    )
    return response.choices[0].message.content