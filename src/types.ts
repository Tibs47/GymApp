export interface Schedule {
    coachID: number,
    confirmed: number,
    createdAt: Date,
    endTime: Date,
    scheduleID: number,
    startTime: Date,
    userID: string,
}

export interface Profile {
    id: string,
    first_name: string,
    last_name: string,
    coach_ID: number,
    role: string,
}