import { Injectable } from '@angular/core';
import { Profile, User } from '../types';
import { supabase } from '../supabase';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor() { }

  public async getUser(): Promise<User> {
    const { data: { user }, error } = await supabase.auth.getUser();

    const userEmail: string = user?.email || 'unknown';
    const userID: string = user?.id || 'unknown';
    const userAuth: User = { email: userEmail, id: userID };

    if (error) {
      console.log('Error with getUser: ', error);
    }
    return userAuth;
  }

  public async getProfile(): Promise<Profile | string>{
    const userAuth = this.getUser();

    let { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', (await userAuth).id);
    if (error) {
      console.log('Error with getProfile: ', error);
    }

    if (profile?.length === 0) {
      return 'noProfile';
    } else {
      const id: string = profile?.[0].id;
      const fisrtName: string = profile?.[0].first_name;
      const lastName: string = profile?.[0].last_name;
      const coachID: number = profile?.[0].coach_ID;
      const role: string = profile?.[0].role;
      const accepted: boolean | null = profile?.[0].accepted;
      const userProfile: Profile = {
        id: id,
        first_name: fisrtName,
        last_name: lastName,
        coach_ID: coachID,
        role: role,
        accepted: accepted,
      }
      return userProfile;
    }
  }
}
