export const sendChatMessage = async (modelId, messages, hyperparameters = {}, guardrailModelId = null) => {
    try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const bodyPayload = { modelId, messages, hyperparameters };
        if (guardrailModelId) {
            bodyPayload.guardrailModelId = guardrailModelId;
        }

        const res = await fetch('/api/playground/chat', {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyPayload)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Playground API error:", error);
        throw error;
    }
};

export const uploadContext = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/playground/upload_context', {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Upload API error:", error);
        throw error;
    }
};
