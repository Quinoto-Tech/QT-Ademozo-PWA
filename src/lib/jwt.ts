import { AdecashUser, CerberoTokenPayload } from '../types';

export class JWTManager {
  static decodeAdecashToken(token: string): AdecashUser | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Validate required fields for Adecash token
      const requiredFields = [
        'first_name', 'last_name', 'curp', 'email', 'company', 
        'max_credit_line', 'remaining_credit_line',
        'ademozo_tenant_name', 'ademozo_tenant'
      ];
      
      for (const field of requiredFields) {
        if (!(field in payload)) {
          console.error(`Missing required field in Adecash token: ${field}`);
          return null;
        }
      }
      
      return {
        first_name: payload.first_name,
        last_name: payload.last_name,
        curp: payload.curp,
        contractor: payload.contractor || '',
        email: payload.email,
        company: payload.company,
        max_credit_line: payload.max_credit_line,
        remaining_credit_line: payload.remaining_credit_line,
        ademozo_tenant_name: payload.ademozo_tenant_name,
        ademozo_tenant: payload.ademozo_tenant
      };
    } catch (error) {
      console.error('Error decoding Adecash token:', error);
      return null;
    }
  }

  static decodeCerberoToken(token: string): CerberoTokenPayload | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Validate required fields for Cerbero token
      const requiredFields = [
        'valid', 'role', 'full_name', 'tenant_uuid', 
        'identifier', 'email', 'exp'
      ];
      
      for (const field of requiredFields) {
        if (!(field in payload)) {
          console.error(`Missing required field in Cerbero token: ${field}`);
          return null;
        }
      }
      
      return {
        valid: payload.valid,
        role: payload.role,
        full_name: payload.full_name,
        tenant_uuid: payload.tenant_uuid,
        identifier: payload.identifier,
        email: payload.email,
        phone: payload.phone || '',
        exp: payload.exp
      };
    } catch (error) {
      console.error('Error decoding Cerbero token:', error);
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp < now;
    } catch (error) {
      return true;
    }
  }

  static extractUserFromTokens(adecashToken: string, cerberoToken: string): AdecashUser | null {
    const adecashData = this.decodeAdecashToken(adecashToken);
    const cerberoData = this.decodeCerberoToken(cerberoToken);
    
    if (!adecashData || !cerberoData || !cerberoData.valid) {
      return null;
    }
    
    // Combine data from both tokens, prioritizing Adecash for user info
    return {
      ...adecashData,
      // Use Cerbero data for validation and tenant info
      ademozo_tenant: cerberoData.tenant_uuid,
      curp: cerberoData.identifier,
      email: cerberoData.email
    };
  }
}