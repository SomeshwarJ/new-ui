import tiktoken

def estimate_claude_tokens(text: str) -> int:
    # Use cl100k_base as a fast offline approximation for Claude tokens
    # Note: Anthropic's official tokenizer is also available via their API 
    # but cl100k_base is within ~1-5% accuracy for Anthropic usually.
    encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(text))
