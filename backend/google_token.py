import os
from google import genai
from google.genai import types

def get_google_tokens(text: str, model: str = "gemini-2.5-flash") -> int:
    try:
        # Strip models/ prefix if present since the new generic API prefers just the name,
        # though it accepts models/ too.
        if model.startswith("models/"):
            model = model[7:]
            
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            # Fallback offline proxy
            import tiktoken
            encoding = tiktoken.get_encoding("cl100k_base")
            return len(encoding.encode(text))
            
        client = genai.Client(api_key=api_key)
        response = client.models.count_tokens(
            model=model,
            contents=text
        )
        return response.total_tokens
    except Exception:
        import tiktoken
        encoding = tiktoken.get_encoding("cl100k_base")
        return len(encoding.encode(text))
