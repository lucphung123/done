import { config } from 'dotenv';
config();

class ConfigServices {
  private getNumber(key: string): number {
    return Number(process.env[key]);
  }

  private getString(key: string): string {
    return process.env[key];
  }

  getPORT(): number {
    return this.getNumber('PORT');
  }

  getDBConfig(): { URL: string, Name: string } {
    return {
      URL: this.getString('DB_URL'),
      Name: this.getString('DB_NAME')
    }
  }

  getJWTConfig(): {secretKey: string, tokenExpired: number, refeshSecretKey: string, refreshExpried: number, tokenType: string} {
    return {
      secretKey: this.getString('JWT_SECRET_KEY'),
      tokenExpired: this.getNumber('JWT_EXPIRATION_TIME'),
      refeshSecretKey: this.getString('JWT_REFRESH_TOKEN_SECRET'),
      refreshExpried: this.getNumber('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      tokenType: this.getString('TOKEN_TYPE')
    }
  }

  getTimeZone() {
    return this.getString('TIMEZONE');
  }
}

export const configServices = new ConfigServices();