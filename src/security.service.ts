import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { catchError, concatMap, firstValueFrom, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';



export type HttpMethod = 'GET' | 'POST';


@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private encKey = environment.ENC_KEY
  private iv = environment.IV;      // 128-bit = 16 chars
  private clientId = "ralbatech"
  private isProd = environment.production;

  constructor(
    private http: HttpClient
  ) { }

  private getKey() {
    return CryptoJS.enc.Base64.parse(this.encKey);
  }

  private getIV() {
    return CryptoJS.enc.Base64.parse(this.iv);
  }

  encrypt(data: any): string {
    const json = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(json, this.getKey(), {
      iv: this.getIV(),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString(); // Base64-encoded ciphertext
  }

  decrypt(encryptedBase64: string): { clientId: string, timestamp: string, nonce: string, signature: string, validForMs: number } {
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, this.getKey(), {
      iv: this.getIV(),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(decryptedText);
    } catch (e) {
      throw new Error("Fail to decryt the text")
    }
  }
  getUrlPath(url: string) {
    const urlArr = url.split("/");
    const v1Index = urlArr.findIndex(str => str === "v1")
    // console.log(v1Index)
    // console.log("/api/" + urlArr.slice(v1Index).join("/"))
    if (v1Index === -1) return url;
    else return "/api/" + urlArr.slice(v1Index).join("/")
  }
  signedRequest<T>(
    method: HttpMethod,
    url: string,
    body: any = null,
    clientId: string = this.clientId // fallback to default clientId
  ): Observable<T> {
    // In non-production, skip signing/encryption entirely
    if (!this.isProd) {
      const token = localStorage.getItem('user_token');
      const headers = new HttpHeaders({
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      });

      const request$ = (
        method === 'GET'
          ? this.http.get<any>(url, { headers })
          : this.http.post<any>(url, body, { headers })
      );

      return request$.pipe(map((resp) => resp));
    }
    // Prepare the signing payload
    // Compute encrypted body string for signing (skip if FormData)
    const isFormData = (typeof FormData !== 'undefined') && (body instanceof FormData);
    const encryptedBodyStr = body && !isFormData ? this.encrypt(body) : null;

    const payload = {
      clientId,
      method,
      path: this.getUrlPath(url),
      bodyStr: encryptedBodyStr,
    };
    // console.log('payload--------',payload)
    const encryptedPayload = this.encrypt(payload);
    const signRequestBody = { carrierPacket: encryptedPayload };
    const signReqUrl = `${environment.secureUrl}sign-request`;

    // Step 1: Get signed headers
    return this.http.post<any>(signReqUrl, signRequestBody).pipe(
      map((response) => {
        const decrypted = this.decrypt(response.payload);

        return {
          'x-client-id': decrypted.clientId,
          'x-timestamp': decrypted.timestamp,
          'x-nonce': decrypted.nonce,
          'x-signature': decrypted.signature,
        };
      }),
      // Step 2: Use signed headers to make actual request
      concatMap((signedHeaders) => {
        const token = localStorage.getItem('user_token');
        const headers = new HttpHeaders({
          ...signedHeaders,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        });

        const request$ = (
          method === 'GET'
            ? this.http.get<any>(url, { headers })
            : this.http.post<any>(url, (body && !isFormData) ? { carrierPacket: encryptedBodyStr } : body, { headers })
        );

        return request$.pipe(
          map((resp) => this.tryDecryptResponse(resp))
        );
      }),
      catchError((error) => {
        // Attempt to decrypt error payloads if present (prod only)
        if (this.isProd) {
          try {
            if (error?.error?.payload && typeof error.error.payload === 'string') {
              const dec = this.decrypt(error.error.payload);
              error.error = dec;
            }
          } catch (_) {}
        }
        console.error(`Signed ${method} request failed for ${url}`, error);
        return throwError(() => error);
      })
    );
  }

  // If API wraps data as { payload: string }, decrypt and return parsed object
  private tryDecryptResponse(resp: any) {
    // Only attempt to decrypt responses in production
    if (!this.isProd) return resp;
    try {
      if (resp && typeof resp === 'object' && typeof resp.payload === 'string') {
        return this.decrypt(resp.payload);
      }
    } catch (e) {
      // If decryption fails, return original response
      return resp;
    }
    return resp;
  }
}

