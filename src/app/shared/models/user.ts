export class User {
  UserId: string | undefined;
  UserTypeId: string | undefined;
  UserName: string | undefined;
  UserFullName: string | undefined;
  UserAltFullName: string | undefined;
  Email: string | undefined;
  PhoneNumber: string | undefined;
  CityId: string | undefined;
  ImageURL: string | undefined;
  CustomerId: string | undefined;
  Identity: string | undefined;
  Role: string | undefined;
  EmailConfirmed: boolean | undefined;

  constructor(private _accessToken: string,
    private _refreshToken: string,
    private _expireDate: Date){
      let user = JSON.parse(atob(_accessToken.split('.')[1]))
      this.UserId = user.UserId;
      this.UserTypeId = user.UserTypeId;
      this.UserName = user.UserName;
      this.UserFullName = user.UserFullName;
      this.UserAltFullName = user.UserAltFullName;
      this.Email = user.Email;
      this.PhoneNumber = user.PhoneNumber;
      this.CityId = user.CityId;
      this.ImageURL = user.ImageURL;
      this.CustomerId = user.CustomerId;
      this.Identity = user.Identity;
      this.Role = user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      this.EmailConfirmed = user.EmailConfirmed;
  }

  get AccessToken(){
    if(!this._expireDate || new Date() > this._expireDate){
      return null;
    }
    return this._accessToken;
  }

  get RefreshToken(){
    if(!this._expireDate || new Date() > this._expireDate){
      return null;
    }
    return this._refreshToken;
  }
  
}


export enum UserRoles {
  admin = 'Admin',
  user = 'User',
}

