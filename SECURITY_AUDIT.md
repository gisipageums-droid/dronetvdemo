# Security Audit Report - DroneTV Frontend

**Date:** March 2024
**Audit Scope:** Frontend Codebase, Dependency Analysis, Authentication Flow, and Data Handling.

---

## 1. Executive Summary

This security audit of the DroneTV frontend application has identified several critical and high-severity vulnerabilities. The most significant risks include hardcoded API keys and credentials, potential Cross-Site Scripting (XSS) via `dangerouslySetInnerHTML`, and insecure storage of sensitive information in `localStorage`. Immediate action is recommended to rotate compromised secrets and implement more robust security practices.

---

## 2. Findings Summary

| ID | Severity | Category | Finding | Recommended Action |
|:---|:---:|:---|:---|:---|
| SEC-01 | **CRITICAL** | Secrets Management | Hardcoded Google Generative AI API Key | Move to Environment Variables and rotate the key immediately. |
| SEC-02 | **CRITICAL** | Secrets Management | Hardcoded MEON OCR Credentials | Move to Environment Variables and rotate credentials. |
| SEC-03 | **HIGH** | Secrets Management | Hardcoded Razorpay Test Key | Move to Environment Variables. |
| SEC-04 | **HIGH** | Data Handling | Insecure `dangerouslySetInnerHTML` usage | Sanitize all HTML content before rendering using a library like DOMPurify. |
| SEC-05 | **HIGH** | Session Management | Sensitive data in `localStorage` | Use Secure, HttpOnly cookies for session tokens. |
| SEC-06 | **MEDIUM** | Dependencies | Vulnerable `xlsx` package | Update to the latest version or replace with a secure alternative. |
| SEC-07 | **MEDIUM** | Authorization | Client-side only Route Protection | Ensure all backend API endpoints enforce strict authorization checks. |
| SEC-08 | **MEDIUM** | API Security | Lack of CSRF Protection | Implement CSRF tokens for all state-changing (POST, PUT, DELETE) requests. |

---

## 3. Detailed Findings

### SEC-01: Hardcoded Google Generative AI API Key
- **File:** `src/components/webbuilder/src/pages/create-portfolio/Component/AllInputField.tsx`
- **Description:** A Google Generative AI API key is hardcoded directly in the source code. This key can be extracted by anyone with access to the frontend bundle and used to make unauthorized API calls on behalf of the project.
- **Recommendation:**
    1. Rotate the API key immediately in the Google Cloud Console.
    2. Store the key in an environment variable (e.g., `.env` file) and access it via `import.meta.env.VITE_GOOGLE_AI_KEY`.

### SEC-02: Hardcoded MEON OCR Credentials
- **File:** `src/components/company/src/components/form/src/components/steps/Step1CompanyCategory.tsx`
- **Description:** Credentials (email and password) for the MEON OCR service are hardcoded in the `handleVerifyGST` function.
- **Recommendation:**
    1. Rotate the MEON OCR password immediately.
    2. Move these credentials to environment variables or, preferably, proxy these requests through a secure backend to avoid exposing credentials to the frontend entirely.

### SEC-03: Hardcoded Razorpay Test Key
- **File:** `src/components/UserDashboard/pages/Buy.tsx`
- **Description:** A Razorpay test key (`rzp_test_...`) is hardcoded as a fallback.
- **Recommendation:** Use environment variables for all third-party keys. Ensure production keys are never committed to version control.

### SEC-04: Insecure `dangerouslySetInnerHTML` Usage
- **Files:** Multiple files, including:
    - `src/components/company/src/components/template/t2/final/preview/src/components/Blog.tsx`
    - `src/components/mainCompanyPreview/t1/src/components/Blog.tsx`
- **Description:** User-provided or API-sourced content is rendered using `dangerouslySetInnerHTML` without sanitization. This is a classic XSS vector.
- **Recommendation:** Use a sanitization library like `dompurify` to clean any HTML before rendering it.
  ```typescript
  import DOMPurify from 'dompurify';
  // ...
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
  ```

### SEC-05: Insecure Data Storage in `localStorage`
- **File:** `src/components/context/context.tsx`
- **Description:** User authentication tokens (`token`, `adminToken`) and complete user/admin objects are stored in `localStorage`. Data in `localStorage` is accessible to any script running on the page, making it highly vulnerable to XSS-based theft.
- **Recommendation:** Store session tokens in **Secure, HttpOnly, SameSite=Strict** cookies. This prevents JavaScript from accessing the tokens, significantly mitigating the risk of token theft.

### SEC-06: Vulnerable `xlsx` Package
- **Issue:** `npm audit` identifies high-severity vulnerabilities (Prototype Pollution, ReDoS) in the `xlsx` package.
- **Recommendation:** Update `xlsx` to a secure version. If no fix is available, consider using a more maintained alternative like `exceljs`.

### SEC-07: Client-side only Route Protection
- **Files:** `src/components/ProtectedRoute.tsx`, `src/components/adminProtectedRoute.tsx`
- **Description:** Route protection is implemented entirely on the client side. A user can bypass these checks by modifying the application state or `localStorage`.
- **Recommendation:** Ensure the backend enforces strict authorization for every API request. The frontend should merely reflect the authorization state provided by the backend.

---

## 4. General Recommendations

1.  **Environment Variables:** Strictly use `.env` files for all configuration, API URLs, and keys. Never commit `.env` files to the repository (ensure they are in `.gitignore`).
2.  **Content Security Policy (CSP):** Implement a strong CSP header to restrict where scripts can be loaded from and where APIs can be called, which helps mitigate XSS and data exfiltration.
3.  **Dependency Updates:** Regularly run `npm audit` and `npm update` to keep dependencies secure.
4.  **Input Validation & Sanitization:** Treat all data from users and external APIs as untrusted. Sanitize it before rendering and validate it before sending it to the backend.
5.  **Use a Backend Proxy:** For sensitive third-party integrations (like OCR or AI services), call them from your backend instead of the frontend. This keeps your API keys secure on the server.
