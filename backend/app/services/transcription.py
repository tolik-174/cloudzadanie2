import os
import tempfile

from deepgram import DeepgramClient
from fastapi import HTTPException, UploadFile

from app.config import DEEPGRAM_API_KEY

ALLOWED_AUDIO_TYPES = {
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/x-m4a",
    "audio/webm",
    "audio/ogg",
    "audio/opus",
}

ALLOWED_EXTENSIONS = {".mp3", ".wav", ".m4a", ".webm", ".ogg", ".opus"}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB


def _get_file_extension(filename: str | None) -> str:
    if not filename or "." not in filename:
        return ""
    return os.path.splitext(filename)[1].lower()


async def transcribe_audio_file(file: UploadFile) -> str:
    if not DEEPGRAM_API_KEY:
        raise HTTPException(status_code=500, detail="Deepgram API key is not configured")

    file_extension = _get_file_extension(file.filename)

    if file.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio type. Use MP3, WAV, M4A, WEBM, OGG, or OPUS."
        )

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file extension. Use .mp3, .wav, .m4a, .webm, .ogg, or .opus."
        )

    content = await file.read()

    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File is too large. Maximum size is 25 MB")

    temp_file_path = None

    try:
        deepgram = DeepgramClient(api_key=DEEPGRAM_API_KEY)

        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name

        with open(temp_file_path, "rb") as audio_file:
            audio_bytes = audio_file.read()

        response = deepgram.listen.v1.media.transcribe_file(
            request=audio_bytes,
            model="nova-3",
            smart_format=True,
            # punctuate=True,
            # paragraphs=True,
            # utterances=True,
            # diarize=True,
            detect_language=True,
        )

        transcript = (
            response.results.channels[0].alternatives[0].transcript
            if response
            and response.results
            and response.results.channels
            and response.results.channels[0].alternatives
            else ""
        )

        if not transcript or not transcript.strip():
            raise HTTPException(
                status_code=422,
                detail="Deepgram returned an empty transcript. Try a clearer or longer audio file."
            )

        return transcript.strip()

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(exc)}")
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception:
                pass