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

// 联系人
export interface Contact {
    contactId: number,
    contactName: string,
    phoneNumber: string,
    createTime: string
}

// 备忘录
export interface DailyRecord {
    dailyId: number,
    title: string,
    content: string,
    createTime: string
}