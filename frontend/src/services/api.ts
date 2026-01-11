import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';

export interface ValidationResponse {
    fields: Record<string, any>;
    validation: ValidationResult[];
    confidence: {
        overall: number;
    };
    assumptions: string[];
}

export interface ValidationResult {
    field: string;
    status: 'PASS' | 'WARN' | 'FAIL';
    expected: string;
    comment: string;
}


export const validateDesign = async (data: { structuredData?: any; freeText?: string }, token: string) => {
    const response = await axios.post<any>(`${API_BASE_URL}/design/validate`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.result as ValidationResponse;
};

export const getValidationHistory = async (token: string) => {
    const response = await axios.get(`${API_BASE_URL}/design/history`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
