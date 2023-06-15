import {DatePipe} from '@angular/common'
import {Injectable} from '@angular/core'
import AES from 'crypto-js/aes';
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'
import ECB from 'crypto-js/mode-ecb'
import Pkcs7 from 'crypto-js/pad-pkcs7'
import {pki, util} from 'node-forge'

@Injectable()
export class CryptoService {
  private encryptKey = 'dc0da04af8fee585'
  private iv
  private base64Key = 'QWJjZGVmZ2hpamtsbW5vcA=='
  private decryptKey
  private datePipe
  private publicKey = `-----BEGIN PUBLIC KEY-----
  MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAg4jN1WF1y/NexPQLzGMf
  x724TG9SlniETKvSm5kdShOgGYiNvoOnPd7yBqD0q6ZSI/7Sl+M1Kcnri+PKMcA0
  3GTEyKkL87swhPYBnx2cku1VUV9dZTK9S0bhNlzuqbk1D5wsD6nNd2o1SqShD3BP
  DrBhCEEs4sYzJOtLl/BpOx0aWh6vsXXNFxtZ3xR7T+EcfbpCWuej88TzztF3uQZF
  aGa53VoN4vLHPob2OKVfzCv0sssNxzP/3ZHV+BiqEqm0o/i6+2ZIX/z5idkNNLZi
  QJ1wI+biFFFioD+XR/6DhzyjN7NH+UCw6K38gxAPPBs5wZdeeluM6yxCef0t3vm5
  jipL1ZGvH+bInNBYNak+wNK/qte5z1fz4O+MmoR0hM9Cr0Vges0LXZK6QX8Qscfd
  wnniKTjBE3qqMq+0N/BKkz40b8tdRvm2wnHcuXR8w53usXkCBsqKYcvnuP8xZy9l
  hJ42wDnAWe4Kcl5HRkxKMzGJ9SbVJOjjw5srfBhmhtVaypRpDGVBLUNVkHxY+bah
  6eJrTTVs74LTY4xCDvNPqlF2DFSRt01x7edAwgaBy+JaTMgsC+Zs4B2oLtoHagnL
  wqm6R62LmHgFWd0qMHrbtLvh+9BH8W2S3wN/Nw3oPpRQkeYQHPj6/VXvHLmcWt1w
  V8qtoCDs3pCqS4LJZazbD0UCAwEAAQ==
  -----END PUBLIC KEY-----
  `

private privateKey = `LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNS
UlFcEFJQkFBS0NBUUVBdXNEL0tCT2Mwcys2dldSZnZ6L0V5YzcwbTVVZ3djTm9mMko5
NUx5bjlzeXE0RTg5Cno2eWxOekdwL1JoTWcwN2VDY1dvcUU2anh6TklCbWNlMmx5cFg
rbEdnTkxycytLNkQzWHZIdGxFUGVNc0lDYVkKNDJEcEtBRWNFc1o5UWpvV2FqUy9aS3
hBUFRmNCtXZHRwUkZQK1dXTytVcjBaUmkwKy9vVEU4YUd6S1B3cE03cApQek51bTVJY
UI2cnliNnNtWitaaVFMdUk1QnNqamdVS0VaS0V2YnBUc2VUOTcyTVI3UjMzZ0FxM2dN
S2hScU1sCkJYelkyUDRua0xlcjVuTS81bjl4Z3VpcVE1Ty83eXRrV0I4a09lSi9pOUR
PVG42OHRqOTI0RmgxYUJTNm5WUUIKd05aNHMzVWZJSHFvTXJHMVRYbTNFUkIwNDFtRV
VPSHY5bXVCL1FJREFRQUJBb0lCQUd4VHpPM3pTbkZpTzZEbQpXeisxZnJITkVVZzZIY
kVuWnpNVTc0L0IrdkFHMGt1Z3kycnVhenR6M0hYS0pYKzVQTVNRV2YrZTloTnpaS0VL
CktmUmg4WUdINy9TRDVHTUk3Z0pQMTIrZWVaNG9hdzBQTm5vV1djaHh0RllUdXM2eW9
SUGtHdTBMbVl1cEx3dUUKZWk1WXQzb2o5ZVlYRzJLVkRVNW9SYTZmNXN0R2d1RnF6UG
x6ZUppWHd2MjlxTjdhUjNiejVmbFNiTEtwWU9GcwpsWGM0R0FQY0VkTXZWUC8wTllCe
DNodDJ0cVVRRjJTcXFKTGdKV2lpOCtJS1o0ZUk4bVpwUk8wQlozSUtlMHBvCi9TRmpx
U2xhRmJCeEVNZ29SRUFzOU5ZWm9OTnI2WmRiQlNUd0lJYUlENEZSMWtvbmREa0d5b0h
pMk8rSHdmcWkKdjlDNFNDVUNnWUVBNnFHekNCc2p4ckpBakRkdEZlTWtPMzZiWisyNX
NYMmErZ01zc3VyditJeDAzQURDcWZPZQp5ajJneHZGQ3QzS3dWOEZEVFZINWFCWlU5Z
WlHMXdVYWd6bG1jNnNSQ0c4VWEreTBzSXAyaktYUEdPNkowNW00Cnd6YzFKQ21ReGpP
T1Fpa2JQdklDa1UwcU5sQmNEZ3UyN2dGN3ZCOTh3N00zZ3piclVOZHhROHNDZ1lFQXk
4TU8KTk5oV3lET054aG5oM2xMRVZNeE12aUE2a0RTOXdaYU5mWi9vTjhsWlR2N2I1cF
d3UlFxU3R4UGJUbStHQ2JyTgpsTXNqaXpUOXorNDViV0lNRVpyemczbDBLa3VaUUtaS
2dKU2lpTXY3TjlYT1AxTnpXYU1nbnJJRnhpbGpnYTJTCm1TMXZPWWd3Uk15aXVyN3JB
U2RaOEV5UkczOS9TOWRyQVdQSmFGY0NnWUFqOUpHVjdXckhHU3ZSRVBGVGlGSlcKRjZ
uQy9HZ1hiZk1nMnZtdmxWY2UxSTlYNDNueFIxY1BFUENoYS9sWVdXZnltcmd3a2g1Uk
9CTGUrRG9wbXl1Ygo3bURuMnRBcVpiTlFjcDZoNnlZTm1aOHA1K3dSRkI1L00rZWQyZ
3pJZ3NBTEhYZUNadDNEM0hwYWhtZ0U4d0NlCmFuWEd0MkNNTU51UjdRbVVndDlsandL
QmdRQ1pWUVlLeEVYQnovRy9BbGtTK1V1ZTJFSmp6RkxsazVxNzQvUkQKZGFMRTRETGh
uQzJVZms0d0ZqM0RvU0NtREl4Y0pBTnlGYytBZ1BjQ2txMEtYLzdlL0xDRTNrK0pTR3
hoMXdFMwpjeUpBT09lcDQ2Mlp2ODJNeFpIVmVmZVlZQ3J1T2RTWWlqVXBvUTlacG5oS
2VVTFZFbXkreEk5cGx1OE8vbU1hCm42Ry9id0tCZ1FEaGl2djM0NjI1NDk5b0huUWVU
S3pLdlUwY0F1STNDcVh1TmxGdHVzekFaTXBLSTlrOG4veWIKSmJBQjVjWmIwdmd2MnJ
pQ3NEdmtlNzJrTVJNNyt5S3RHeEttdUpNQzlJZWs0MnphODAvbEQxT2RmWWRCZmgvVg
prbVl3UXYzc2g2cC9yWDRUVGxHSmZMcTh1VEc2Mk84ZFVXOWFiMzZIVktjTHE5MGtwa
mFwY3c9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo`;




  constructor() {
    this.decryptKey = Base64.parse(this.base64Key)
    this.datePipe = new DatePipe('en-US')
    this.iv = 'dc0da04af8fee585'
  }

  decrypt(text: string): string {
    const decryptedData = AES.decrypt(text, this.decryptKey, {
      mode: ECB,
      padding: Pkcs7,
    })
    const decryptedText = decryptedData.toString(Utf8)
    return decryptedText
  }

  encrypt(text: string): string {
    const mov = Utf8.parse(
      this.datePipe.transform(new Date(), 'yyyyMMddhhmmssSSS') + text,
    )

    const encrypted = AES.encrypt(mov, this.encryptKey, {
      keySize: 128 / 8,
      // @ts-ignore
      iv: this.iv,
      mode: ECB,
      padding: Pkcs7
    })
    const output = encrypted.toString()
    const base64 = Base64.stringify(Utf8.parse(output))
    return base64
  }

  encryptRSA(text: string): string {
    const mov = this.datePipe.transform(new Date(), 'yyyyMMddhhmmssSSS') + text
    const pk = pki.publicKeyFromPem(this.publicKey) as pki.rsa.PublicKey
    const buffer = util.createBuffer(mov, 'utf8')
    const bytes = buffer.getBytes()

    // encrypt data with a public key using RSAES PKCS#1 v1.5
    const encrypted = pk.encrypt(bytes, 'RSAES-PKCS1-V1_5')

    // base64-encode encrypted data to send to server
    const b64Encoded = util.encode64(encrypted)

    return b64Encoded
  }

  decryptRSA(text: string): string {

    // base64-encode encrypted data to send to server

    const PKBody = util.decode64(this.privateKey);

    const pk = pki.privateKeyFromPem(PKBody);

    return util.decodeUtf8(pk.decrypt(util.decode64(text)));

   

  }
}

