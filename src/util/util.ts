import axios from 'axios';

export interface HealthRecord {
    healthId: number,
    height: number,
    weight: number,
    BMI: number,
    conclusion: string,
    createTime: string
}

export interface FinanceRecord {
    financeId: number,
    financeType: number, // 1:收入  2:支出
    amount: number,
    remark: string,
    createTime: string
}

