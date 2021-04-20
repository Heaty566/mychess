export function spawnOtpCode(length: number, type: 'sms' | 'email') {
      const pattern = {
            sms: '0123456789',
            email: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      };

      let result = '';
      const characters = pattern[type];
      const charactersLength = pattern[type].length;
      for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));

      return process.env.DOC === 'active' ? '1234567890' : result;
}
